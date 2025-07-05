const mongoose = require('mongoose');

const { Schema } = mongoose;

const seatReservationSchema = new Schema({
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
  }
}, { _id: false });

const reservationSchema = new Schema({
  reservationNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'RES' + Date.now() + Math.floor(Math.random() * 1000);
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
  startAt: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Validasi format waktu HH:MM
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  seats: {
    type: [seatReservationSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one seat must be selected'
    }
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
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
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  checkin: {
    type: Boolean,
    default: false
  },
  checkinTime: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  // Untuk tracking expiry time reservasi
  expiresAt: {
    type: Date,
    default: function() {
      // Reservasi expired dalam 15 menit jika tidak dikonfirmasi
      return new Date(Date.now() + 15 * 60 * 1000);
    }
  }
}, { timestamps: true });

// Index untuk query yang sering digunakan
reservationSchema.index({ reservationNumber: 1 });
reservationSchema.index({ userId: 1 });
reservationSchema.index({ movieId: 1, cinemaId: 1, date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ expiresAt: 1 });

// Pre-save middleware untuk calculate total
reservationSchema.pre('save', function(next) {
  if (this.isModified('seats') || this.isModified('ticketPrice')) {
    this.total = this.seats.length * this.ticketPrice;
  }
  next();
});

// Method untuk confirm reservation
reservationSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.paymentStatus = 'paid';
  this.expiresAt = undefined; // Remove expiry when confirmed
  return this.save();
};

// Method untuk cancel reservation
reservationSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Method untuk checkin
reservationSchema.methods.checkin = function() {
  this.checkin = true;
  this.checkinTime = new Date();
  this.status = 'completed';
  return this.save();
};

// Method untuk check if reservation is expired
reservationSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt && this.status === 'pending';
};

// Static method untuk cleanup expired reservations
reservationSchema.statics.cleanupExpired = async function() {
  const expiredReservations = await this.find({
    status: 'pending',
    expiresAt: { $lt: new Date() }
  });
  
  for (const reservation of expiredReservations) {
    await reservation.cancel();
  }
  
  return expiredReservations.length;
};

// Virtual untuk mendapatkan seat count
reservationSchema.virtual('seatCount').get(function() {
  return this.seats.length;
});

// Virtual untuk format seat display
reservationSchema.virtual('seatDisplay').get(function() {
  return this.seats.map(seat => `${seat.row}${seat.number}`).join(', ');
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;