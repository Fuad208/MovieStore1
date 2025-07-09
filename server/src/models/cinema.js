const mongoose = require('mongoose');

const { Schema } = mongoose;

const seatSchema = new Schema({
  row: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^[A-Z]$/ // Only single uppercase letter
  },
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 50 // Reasonable limit for seat numbers
  },
  available: {
    type: Boolean,
    default: true
  },
  seatType: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  }
}, { _id: false });

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000 // Reasonable price limit
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 50
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  seats: {
    type: [seatSchema],
    required: true,
    validate: {
      validator: function(v) {
        // Check for duplicate seats
        const seatIds = v.map(seat => `${seat.row}${seat.number}`);
        return seatIds.length === new Set(seatIds).size;
      },
      message: 'Duplicate seats are not allowed'
    }
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 0,
    default: function() {
      return this.seats ? this.seats.filter(seat => seat.available).length : 0;
    }
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 0,
    default: function() {
      return this.seats ? this.seats.length : 0;
    }
  },
  image: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image must be a valid URL'
    }
  },
  facilities: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
cinemaSchema.index({ city: 1, isActive: 1 });
cinemaSchema.index({ name: 1 });

// Virtual for occupancy rate
cinemaSchema.virtual('occupancyRate').get(function() {
  if (this.totalSeats === 0) return 0;
  return ((this.totalSeats - this.seatsAvailable) / this.totalSeats * 100).toFixed(2);
});

// Pre-save middleware to update seat counts
cinemaSchema.pre('save', function(next) {
  if (this.isModified('seats')) {
    this.totalSeats = this.seats.length;
    this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  }
  next();
});

// Method to update available seats count
cinemaSchema.methods.updateAvailableSeats = function() {
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  this.totalSeats = this.seats.length;
  return this.save();
};

// Method to book seats with transaction safety
cinemaSchema.methods.bookSeats = async function(seatNumbers, session = null) {
  const bookedSeats = [];
  const unavailableSeats = [];
  
  // Check all seats availability first
  for (const seatNum of seatNumbers) {
    const seat = this.seats.find(s => 
      s.row === seatNum.row && s.number === seatNum.number
    );
    
    if (!seat) {
      throw new Error(`Seat ${seatNum.row}${seatNum.number} does not exist`);
    }
    
    if (!seat.available) {
      unavailableSeats.push(`${seatNum.row}${seatNum.number}`);
    }
  }
  
  if (unavailableSeats.length > 0) {
    throw new Error(`Seats ${unavailableSeats.join(', ')} are not available`);
  }
  
  // Book all seats
  seatNumbers.forEach(seatNum => {
    const seat = this.seats.find(s => 
      s.row === seatNum.row && s.number === seatNum.number
    );
    seat.available = false;
    bookedSeats.push(seat);
  });
  
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  
  if (session) {
    return this.save({ session });
  }
  
  await this.save();
  return bookedSeats;
};

// Method to release seats
cinemaSchema.methods.releaseSeats = async function(seatNumbers, session = null) {
  const releasedSeats = [];
  
  seatNumbers.forEach(seatNum => {
    const seat = this.seats.find(s => 
      s.row === seatNum.row && s.number === seatNum.number
    );
    if (seat) {
      seat.available = true;
      releasedSeats.push(seat);
    }
  });
  
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  
  if (session) {
    return this.save({ session });
  }
  
  await this.save();
  return releasedSeats;
};

// Method to get seat by row and number
cinemaSchema.methods.getSeat = function(row, number) {
  return this.seats.find(s => s.row === row && s.number === number);
};

// Method to get available seats by type
cinemaSchema.methods.getAvailableSeatsByType = function(seatType = null) {
  let availableSeats = this.seats.filter(seat => seat.available);
  
  if (seatType) {
    availableSeats = availableSeats.filter(seat => seat.seatType === seatType);
  }
  
  return availableSeats;
};

// Static method to find cinemas by city
cinemaSchema.statics.findByCity = function(city) {
  return this.find({ 
    city: city.toLowerCase(), 
    isActive: true 
  }).sort({ name: 1 });
};

// Static method to search cinemas
cinemaSchema.statics.searchCinemas = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { city: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } }
    ],
    isActive: true
  }).sort({ name: 1 });
};

const Cinema = mongoose.models.Cinema || mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;