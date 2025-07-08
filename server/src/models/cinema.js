const mongoose = require('mongoose');

const { Schema } = mongoose;

const seatSchema = new Schema({
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
  available: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  seats: {
    type: [seatSchema],
    required: true,
    default: []
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
    default: ''
  }
}, { timestamps: true });

// Method untuk menghitung ulang jumlah kursi tersedia
cinemaSchema.methods.updateAvailableSeats = function() {
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  this.totalSeats = this.seats.length;
  return this.save();
};

// Method untuk booking kursi
cinemaSchema.methods.bookSeats = function(seatNumbers) {
  const bookedSeats = [];
  
  seatNumbers.forEach(seatNum => {
    const seat = this.seats.find(s => 
      s.row === seatNum.row && s.number === seatNum.number
    );
    if (seat && seat.available) {
      seat.available = false;
      bookedSeats.push(seat);
    }
  });
  
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
  return bookedSeats;
};

// Method untuk release kursi
cinemaSchema.methods.releaseSeats = function(seatNumbers) {
  seatNumbers.forEach(seatNum => {
    const seat = this.seats.find(s => 
      s.row === seatNum.row && s.number === seatNum.number
    );
    if (seat) {
      seat.available = true;
    }
  });
  
  this.seatsAvailable = this.seats.filter(seat => seat.available).length;
};

const Cinema = mongoose.models.Cinema || mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;