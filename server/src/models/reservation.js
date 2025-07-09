const mongoose = require('mongoose');

const { Schema } = mongoose;

const seatReservationSchema = new Schema({
  row: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^[A-Z]$/
  },
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 50
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
        if (!v || v.length === 0) return false;
        if (v.length > 10) return false; // Max 10 seats per reservation
        
        // Check for duplicate seats
        const seatIds = v.map(seat => `${seat.row}${seat.number}`);
        return seatIds.length === new Set(seatIds).size;
      },
      message: 'Invalid seats: must have at least 1 seat, max 10 seats, and no duplicates'
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
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  finalTotal: {
    type: Number,
    required: true,
    min: 0
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
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[\+]?[0-9\s\-\(\)]+$/
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
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
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer', 'loyalty_points'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed', 'partial'],
    default: 'pending'
  },
  paymentReference: {
    type: String,
    trim: true
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 300
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }
  },
  confirmedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
reservationSchema.index({ reservationNumber: 1 });
reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ movieId: 1, cinemaId: 1, date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ expiresAt: 1 });
reservationSchema.index({ createdAt: 1 });
reservationSchema.index({ showtimeId: 1 });

// Virtual for seat count
reservationSchema.virtual('seatCount').get(function() {
  return this.seats.length;
});

// Virtual for seat display
reservationSchema.virtual('seatDisplay').get(function() {
  return this.seats.map(seat => `${seat.row}${seat.number}`).join(', ');
});

// Virtual for formatted date
reservationSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for formatted time
reservationSchema.virtual('formattedTime').get(function() {
  return this.startAt;
});

// Virtual for showtime datetime
reservationSchema.virtual('showtimeDateTime').get(function() {
  const datetime = new Date(this.date);
  const [hours, minutes] = this.startAt.split(':').map(Number);
  datetime.setHours(hours, minutes, 0, 0);
  return datetime;
});

// Virtual for checking if reservation is upcoming
reservationSchema.virtual('isUpcoming').get(function() {
  return this.showtimeDateTime > new Date() && this.status === 'confirmed';
});

// Virtual for checking if reservation is past
reservationSchema.virtual('isPast').get(function() {
  return this.showtimeDateTime < new Date();
});

// Virtual for time until showtime
reservationSchema.virtual('timeUntilShowtime').get(function() {
  if (this.showtimeDateTime <= new Date()) return 0;
  return this.showtimeDateTime - new Date();
});

// Pre-save middleware to calculate totals
reservationSchema.pre('save', function(next) {
  if (this.isModified('seats') || this.isModified('ticketPrice') || this.isModified('discount') || this.isModified('tax')) {
    this.total = this.seats.length * this.ticketPrice;
    this.finalTotal = this.total - this.discount + this.tax;
    
    // Calculate loyalty points earned (1 point per dollar spent)
    if (this.status === 'confirmed' && this.paymentStatus === 'paid') {
      this.loyaltyPointsEarned = Math.floor(this.finalTotal);
    }
  }
  next();
});

// Pre-save middleware to set timestamps
reservationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'confirmed':
        if (!this.confirmedAt) this.confirmedAt = now;
        this.expiresAt = undefined; // Remove expiry when confirmed
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
      case 'refunded':
        if (!this.refundedAt) this.refundedAt = now;
        break;
    }
  }
  next();
});

// Method to confirm reservation
reservationSchema.methods.confirm = async function(session = null) {
  if (this.status !== 'pending') {
    throw new Error('Only pending reservations can be confirmed');
  }
  
  if (this.isExpired()) {
    throw new Error('Reservation has expired');
  }
  
  this.status = 'confirmed';
  this.paymentStatus = 'paid';
  this.confirmedAt = new Date();
  this.expiresAt = undefined;
  
  if (session) {
    return this.save({ session });
  }
  
  return this.save();
};

// Method to cancel reservation
reservationSchema.methods.cancel = async function(reason = null, session = null) {
  if (this.status === 'completed' || this.status === 'refunded') {
    throw new Error('Cannot cancel completed or refunded reservations');
  }
  
  const wasConfirmed = this.status === 'confirmed';
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  
  if (reason) {
    this.notes = (this.notes ? this.notes + '\n' : '') + `Cancelled: ${reason}`;
  }
  
  // If it was confirmed and paid, mark for refund
  if (wasConfirmed && this.paymentStatus === 'paid') {
    this.paymentStatus = 'refunded';
    this.refundAmount = this.finalTotal;
    this.refundReason = reason || 'Cancellation';
  }
  
  if (session) {
    return this.save({ session });
  }
  
  return this.save();
};

// Method to process refund
reservationSchema.methods.processRefund = async function(amount = null, reason = null, session = null) {
  if (this.status !== 'cancelled' && this.status !== 'confirmed') {
    throw new Error('Only cancelled or confirmed reservations can be refunded');
  }
  
  this.status = 'refunded';
  this.paymentStatus = 'refunded';
  this.refundedAt = new Date();
  this.refundAmount = amount || this.finalTotal;
  this.refundReason = reason || 'Refund processed';
  
  if (session) {
    return this.save({ session });
  }
  
  return this.save();
};

// Method to checkin
reservationSchema.methods.performCheckin = async function(session = null) {
  if (this.status !== 'confirmed') {
    throw new Error('Only confirmed reservations can be checked in');
  }
  
  if (this.checkin) {
    throw new Error('Reservation already checked in');
  }
  
  const now = new Date();
  const showtimeDate = this.showtimeDateTime;
  
  // Allow checkin 30 minutes before showtime
  if (now < (showtimeDate.getTime() - 30 * 60 * 1000)) {
    throw new Error('Checkin not available yet');
  }
  
  // Don't allow checkin more than 30 minutes after showtime
  if (now > (showtimeDate.getTime() + 30 * 60 * 1000)) {
    throw new Error('Checkin period has expired');
  }
  
  this.checkin = true;
  this.checkinTime = now;
  this.status = 'completed';
  
  if (session) {
    return this.save({ session });
  }
  
  return this.save();
};

// Method to check if reservation is expired
reservationSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt && this.status === 'pending';
};

// Method to extend expiry
reservationSchema.methods.extendExpiry = function(minutes = 15) {
  if (this.status !== 'pending') {
    throw new Error('Can only extend expiry for pending reservations');
  }
  
  this.expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  return this.save();
};

// Method to apply discount
reservationSchema.methods.applyDiscount = function(discountAmount, reason = null) {
  if (this.status !== 'pending') {
    throw new Error('Can only apply discount to pending reservations');
  }
  
  this.discount = discountAmount;
  this.finalTotal = this.total - this.discount + this.tax;
  
  if (reason) {
    this.notes = (this.notes ? this.notes + '\n' : '') + `Discount applied: ${reason}`;
  }
  
  return this.save();
};

// Method to use loyalty points
reservationSchema.methods.useLoyaltyPoints = function(points) {
  if (this.status !== 'pending') {
    throw new Error('Can only use loyalty points for pending reservations');
  }
  
  this.loyaltyPointsUsed = points;
  this.discount = (this.discount || 0) + points; // 1 point = 1 unit of currency
  this.finalTotal = this.total - this.discount + this.tax;
  
  return this.save();
};

// Static method to cleanup expired reservations
reservationSchema.statics.cleanupExpired = async function() {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const expiredReservations = await this.find({
      status: 'pending',
      expiresAt: { $lt: new Date() }
    }).session(session);
    
    // Release seats for expired reservations
    for (const reservation of expiredReservations) {
      await reservation.cancel('Expired', session);
      
      // Release seats in showtime
      const Showtime = mongoose.model('Showtime');
      const showtime = await Showtime.findById(reservation.showtimeId).session(session);
      if (showtime) {
        await showtime.releaseSeats(reservation._id, session);
      }
    }
    
    await session.commitTransaction();
    return expiredReservations.length;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Static method to find reservations by user
reservationSchema.statics.findByUser = function(userId, status = null) {
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('movieId', 'title image duration')
    .populate('cinemaId', 'name address city')
    .sort({ createdAt: -1 });
};

// Static method to find upcoming reservations
reservationSchema.statics.findUpcoming = function(userId = null) {
  const query = {
    status: 'confirmed',
    date: { $gte: new Date() }
  };
  
  if (userId) query.userId = userId;
  
  return this.find(query)
    .populate('movieId', 'title image duration')
    .populate('cinemaId', 'name address city')
    .sort({ date: 1, startAt: 1 });
};

// Static method to find reservations by date range
reservationSchema.statics.findByDateRange = function(startDate, endDate, status = null) {
  const query = {
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (status) query.status = status;
  
  return this.find(query)
    .populate('movieId', 'title')
    .populate('cinemaId', 'name')
    .populate('userId', 'username email')
    .sort({ date: 1, startAt: 1 });
};

// Static method to get reservation statistics
reservationSchema.statics.getStatistics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$finalTotal' },
        totalSeats: { $sum: { $size: '$seats' } }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;