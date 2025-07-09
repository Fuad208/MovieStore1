const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200
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
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 50
  },
  genre: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 10;
      },
      message: 'At least one genre is required, maximum 10 genres'
    }
  },
  director: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  cast: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 50;
      },
      message: 'At least one cast member is required, maximum 50 cast members'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 600 // 10 hours max
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
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  trailerUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Trailer URL must be a valid URL'
    }
  },
  cinemaIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  budget: {
    type: Number,
    min: 0
  },
  boxOffice: {
    type: Number,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: 1 });
movieSchema.index({ endDate: 1 });
movieSchema.index({ isActive: 1, releaseDate: 1 });
movieSchema.index({ rating: 1 });

// Virtual for duration in formatted string
movieSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Virtual for checking if movie is currently showing
movieSchema.virtual('isCurrentlyShowing').get(function() {
  const now = new Date();
  return this.isActive && 
         this.releaseDate <= now && 
         this.endDate >= now;
});

// Virtual for checking if movie is upcoming
movieSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.isActive && this.releaseDate > now;
});

// Virtual for checking if movie has ended
movieSchema.virtual('hasEnded').get(function() {
  const now = new Date();
  return this.endDate < now;
});

// Virtual for days until release
movieSchema.virtual('daysUntilRelease').get(function() {
  if (this.releaseDate <= new Date()) return 0;
  const diffTime = this.releaseDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days remaining
movieSchema.virtual('daysRemaining').get(function() {
  if (this.endDate <= new Date()) return 0;
  const diffTime = this.endDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware for validation
movieSchema.pre('save', function(next) {
  if (this.endDate <= this.releaseDate) {
    next(new Error('End date must be after release date'));
  } else {
    next();
  }
});

// Method to check if movie is currently showing
movieSchema.methods.isCurrentlyShowing = function() {
  const now = new Date();
  return this.isActive && 
         this.releaseDate <= now && 
         this.endDate >= now;
};

// Method to add cinema to movie
movieSchema.methods.addCinema = function(cinemaId) {
  if (!this.cinemaIds.includes(cinemaId)) {
    this.cinemaIds.push(cinemaId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove cinema from movie
movieSchema.methods.removeCinema = function(cinemaId) {
  this.cinemaIds = this.cinemaIds.filter(id => !id.equals(cinemaId));
  return this.save();
};

// Method to extend showing period
movieSchema.methods.extendShowing = function(newEndDate) {
  if (newEndDate <= this.endDate) {
    throw new Error('New end date must be after current end date');
  }
  this.endDate = newEndDate;
  return this.save();
};

// Static method to find currently showing movies
movieSchema.statics.findCurrentlyShowing = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    releaseDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ releaseDate: -1 });
};

// Static method to find upcoming movies
movieSchema.statics.findUpcoming = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    releaseDate: { $gt: now }
  }).sort({ releaseDate: 1 });
};

// Static method to search movies
movieSchema.statics.searchMovies = function(query) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { director: { $regex: query, $options: 'i' } },
      { cast: { $in: [new RegExp(query, 'i')] } },
      { genre: { $in: [new RegExp(query, 'i')] } }
    ],
    isActive: true
  }).sort({ releaseDate: -1 });
};

// Static method to find movies by genre
movieSchema.statics.findByGenre = function(genre) {
  return this.find({
    genre: { $in: [genre] },
    isActive: true
  }).sort({ releaseDate: -1 });
};

// Static method to find movies by rating
movieSchema.statics.findByRating = function(rating) {
  return this.find({
    rating: rating,
    isActive: true
  }).sort({ releaseDate: -1 });
};

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

module.exports = Movie;