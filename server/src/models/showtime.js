const mongoose = require('mongoose');

const { Schema } = mongoose;

const reservedSeatSchema = new Schema({
  row: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  number: {
    type: Number,
    required: true,
    min: 1
  },
  reservationId: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  reservedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const showtimeSchema = new Schema({
  startTimes: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        if (!v || v.length === 0) return false;
        // Validate time format HH:MM
        return v.every(time => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time));
      },
      message: 'All start times must be in HH:MM format'
    }
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Date must be a valid date'
    }
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v) && v >= this.date;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  availableSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  reservedSeats: [reservedSeatSchema],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  specialPrice: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSpecialShowing: {
    type: Boolean,
    default: false
  },
  specialShowingType: {
    type: String,
    enum: ['premiere', 'midnight', 'matinee', 'discount'],
    required: function() {
      return this.isSpecialShowing;
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
showtimeSchema.index({ movieId: 1, cinemaId: 1, date: 1 });
showtimeSchema.index({ date: 1, isActive: 1 });
showtimeSchema.index({ cinemaId: 1, date: 1 });
showtimeSchema.index({ movieId: 1, date: 1 });

// Virtual for occupancy rate
showtimeSchema.virtual('occupancyRate').get(function() {
  if (this.totalSeats === 0) return 0;
  return ((this.totalSeats - this.availableSeats) / this.totalSeats * 100).toFixed(2);
});

// Virtual for checking if showtime is available
showtimeSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.isActive && this.date >= now && this.availableSeats > 0;
});

// Virtual for checking if showtime is sold out
showtimeSchema.virtual('isSoldOut').get(function() {
  return this.availableSeats === 0;
});

// Virtual for effective price (special price if applicable)
showtimeSchema.virtual('effectivePrice').get(function() {
  return this.isSpecialShowing && this.specialPrice ? this.specialPrice : this.price;
});

// Pre-save middleware to set total seats and available seats from cinema
showtimeSchema.pre('save', async function(next) {
  if (this.isNew && this.cinemaId) {
    try {
      const Cinema = mongoose.model('Cinema');
      const cinema = await Cinema.findById(this.cinemaId);
      if (cinema) {
        this.totalSeats = cinema.totalSeats;
        this.availableSeats = cinema.totalSeats;
      }
    } catch (error) {
      console.error('Error setting seats from cinema:', error);
    }
  }
  next();
});

// Method to check if showtime is available
showtimeSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.isActive && this.date >= now && this.availableSeats > 0;
};

// Method to check if specific time slot is available
showtimeSchema.methods.isTimeSlotAvailable = function(timeSlot) {
  const now = new Date();
  const showtimeDate = new Date(this.date);
  const [hours, minutes] = timeSlot.split(':').map(Number);
  showtimeDate.setHours(hours, minutes, 0, 0);
  
  return this.isActive && 
         showtimeDate > now && 
         this.startTimes.includes(timeSlot) && 
         this.availableSeats > 0;
};

// Method to reserve seats with transaction safety
showtimeSchema.methods.reserveSeats = async function(seats, reservationId, session = null) {
  // Check if seats are already reserved
  const conflictingSeats = [];
  
  for (const seat of seats) {
    const isReserved = this.reservedSeats.some(reserved => 
      reserved.row === seat.row && reserved.number === seat.number
    );
    
    if (isReserved) {
      conflictingSeats.push(`${seat.row}${seat.number}`);
    }
  }
  
  if (conflictingSeats.length > 0) {
    throw new Error(`Seats ${conflictingSeats.join(', ')} are already reserved`);
  }
  
  if (this.availableSeats < seats.length) {
    throw new Error('Not enough available seats');
  }
  
  // Reserve the seats
  seats.forEach(seat => {
    this.reservedSeats.push({
      row: seat.row,
      number: seat.number,
      reservationId: reservationId
    });
  });
  
  this.availableSeats -= seats.length;
  
  if (session) {
    return this.save({ session });
  }
  
  return this.save();
};

// Method to release seats
showtimeSchema.methods.releaseSeats = async function(reservationId, session = null) {
  const releasedSeats = this.reservedSeats.filter(seat => 
    seat.reservationId.toString() === reservationId.toString()
  );
  
  this.reservedSeats = this.reservedSeats.filter(seat => 
    seat.reservationId.toString() !== reservationId.toString()
  );
  
  this.availableSeats += releasedSeats.length;
  
  if (session) {
    return this.save({ session });
  }
  
  await this.save();
  return releasedSeats;
};

// Method to get available seats for a cinema
showtimeSchema.methods.getAvailableSeats = async function() {
  const Cinema = mongoose.model('Cinema');
  const cinema = await Cinema.findById(this.cinemaId);
  
  if (!cinema) {
    throw new Error('Cinema not found');
  }
  
  const reservedSeatNumbers = this.reservedSeats.map(seat => ({
    row: seat.row,
    number: seat.number
  }));
  
  return cinema.seats.filter(seat => {
    return seat.available && !reservedSeatNumbers.some(reserved => 
      reserved.row === seat.row && reserved.number === seat.number
    );
  });
};

// Method to get reserved seats for a specific reservation
showtimeSchema.methods.getReservedSeatsForReservation = function(reservationId) {
  return this.reservedSeats.filter(seat => 
    seat.reservationId.toString() === reservationId.toString()
  );
};

// Method to check seat availability
showtimeSchema.methods.isSeatAvailable = function(row, number) {
  return !this.reservedSeats.some(seat => 
    seat.row === row && seat.number === number
  );
};

// Method to get showtime for specific time
showtimeSchema.methods.getShowtimeForTime = function(timeSlot) {
  if (!this.startTimes.includes(timeSlot)) {
    throw new Error('Time slot not available for this showtime');
  }
  
  const showtimeDate = new Date(this.date);
  const [hours, minutes] = timeSlot.split(':').map(Number);
  showtimeDate.setHours(hours, minutes, 0, 0);
  
  return {
    datetime: showtimeDate,
    timeSlot: timeSlot,
    isAvailable: this.isTimeSlotAvailable(timeSlot)
  };
};

// Static method to find showtimes by movie and cinema
showtimeSchema.statics.findByMovieAndCinema = function(movieId, cinemaId, date = null) {
  const query = { movieId, cinemaId, isActive: true };
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    query.date = { $gte: startDate, $lt: endDate };
  } else {
    query.date = { $gte: new Date() };
  }
  
  return this.find(query).sort({ date: 1 });
};

// Static method to find available showtimes
showtimeSchema.statics.findAvailable = function(movieId = null, cinemaId = null, date = null) {
  const query = { 
    isActive: true, 
    date: { $gte: new Date() },
    availableSeats: { $gt: 0 }
  };
  
  if (movieId) query.movieId = movieId;
  if (cinemaId) query.cinemaId = cinemaId;
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    query.date = { $gte: startDate, $lt: endDate };
  }
  
  return this.find(query).sort({ date: 1 });
};

// Static method to find showtimes by date range
showtimeSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    isActive: true
  }).sort({ date: 1 });
};

// Static method to cleanup expired showtimes
showtimeSchema.statics.cleanupExpired = async function() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const result = await this.updateMany(
    { date: { $lt: yesterday } },
    { isActive: false }
  );
  
  return result.modifiedCount;
};

const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;