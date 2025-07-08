const mongoose = require('mongoose');

const { Schema } = mongoose;

const showtimeSchema = new Schema({
  // Hapus duplikat startAt dan perbaiki struktur
  startTimes: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one start time is required'
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
  cinemaId: { // Perbaiki nama field dari cinemaIds ke cinemaId
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  // Tambah field untuk tracking seat availability per showtime
  availableSeats: {
    type: Number,
    default: 0
  },
  // Track reserved seats untuk setiap showtime
  reservedSeats: [{
    row: String,
    number: Number,
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation'
    }
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index untuk query yang sering digunakan
showtimeSchema.index({ movieId: 1, cinemaId: 1, date: 1 });
showtimeSchema.index({ date: 1 });
showtimeSchema.index({ cinemaId: 1 });

// Method untuk cek apakah showtime masih tersedia
showtimeSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.isActive && this.date >= now;
};

// Method untuk reserve seats
showtimeSchema.methods.reserveSeats = function(seats, reservationId) {
  seats.forEach(seat => {
    this.reservedSeats.push({
      row: seat.row,
      number: seat.number,
      reservationId: reservationId
    });
  });
  
  this.availableSeats -= seats.length;
  return this.save();
};

// Method untuk release seats
showtimeSchema.methods.releaseSeats = function(reservationId) {
  const releasedSeats = this.reservedSeats.filter(seat => 
    seat.reservationId.toString() === reservationId.toString()
  );
  
  this.reservedSeats = this.reservedSeats.filter(seat => 
    seat.reservationId.toString() !== reservationId.toString()
  );
  
  this.availableSeats += releasedSeats.length;
  return this.save();
};

// Method untuk get available seats
showtimeSchema.methods.getAvailableSeats = function(cinema) {
  const reservedSeatNumbers = this.reservedSeats.map(seat => ({
    row: seat.row,
    number: seat.number
  }));
  
  return cinema.seats.filter(seat => {
    return !reservedSeatNumbers.some(reserved => 
      reserved.row === seat.row && reserved.number === seat.number
    );
  });
};

// Pre-save middleware untuk set available seats dari cinema
showtimeSchema.pre('save', async function(next) {
  if (this.isNew && this.cinemaId) {
    try {
      const Cinema = mongoose.model('Cinema');
      const cinema = await Cinema.findById(this.cinemaId);
      if (cinema) {
        this.availableSeats = cinema.totalSeats;
      }
    } catch (error) {
      console.error('Error setting available seats:', error);
    }
  }
  next();
});

const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;