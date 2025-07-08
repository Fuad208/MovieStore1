const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    // Hapus lowercase untuk title agar lebih fleksibel
  },
  image: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genre: {
    type: [String], // Ubah ke array untuk multiple genre
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one genre is required'
    }
  },
  director: {
    type: String,
    required: true,
    trim: true,
    // Hapus lowercase untuk nama director
  },
  cast: {
    type: [String], // Ubah ke array untuk multiple cast
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one cast member is required'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    // Hapus lowercase untuk description
  },
  duration: {
    type: Number,
    required: true,
    min: 1, // Minimal 1 menit
    max: 600 // Maksimal 10 jam
  },
  releaseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Release date must be a valid date'
    }
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v) && v > this.releaseDate;
      },
      message: 'End date must be after release date'
    }
  },
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'PG'
  },
  cinemaIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index untuk pencarian
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: 1 });
movieSchema.index({ endDate: 1 });

// Method untuk cek apakah movie masih aktif
movieSchema.methods.isCurrentlyShowing = function() {
  const now = new Date();
  return this.isActive && 
         this.releaseDate <= now && 
         this.endDate >= now;
};

// Virtual untuk mendapatkan duration dalam format jam:menit
movieSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Pre-save middleware untuk validasi tanggal
movieSchema.pre('save', function(next) {
  if (this.endDate <= this.releaseDate) {
    next(new Error('End date must be after release date'));
  } else {
    next();
  }
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

module.exports = Movie;