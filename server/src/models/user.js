const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[\+]?[0-9\s\-\(\)]+$/
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || (v instanceof Date && !isNaN(v) && v < new Date());
      },
      message: 'Date of birth must be a valid date in the past'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    lowercase: true
  },
  avatar: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Avatar must be a valid URL'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    favoriteGenres: [{
      type: String,
      trim: true
    }]
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  reservationCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for loyalty tier
userSchema.virtual('loyaltyTier').get(function() {
  if (this.loyaltyPoints >= 10000) return 'platinum';
  if (this.loyaltyPoints >= 5000) return 'gold';
  if (this.loyaltyPoints >= 1000) return 'silver';
  return 'bronze';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

// Method to verify email
userSchema.methods.verifyEmail = function() {
  this.isEmailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  return this.save();
};

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = function(points) {
  this.loyaltyPoints += points;
  return this.save();
};

// Method to deduct loyalty points
userSchema.methods.deductLoyaltyPoints = function(points) {
  if (this.loyaltyPoints >= points) {
    this.loyaltyPoints -= points;
    return this.save();
  }
  throw new Error('Insufficient loyalty points');
};

// Method to update spending
userSchema.methods.updateSpending = function(amount) {
  this.totalSpent += amount;
  this.reservationCount += 1;
  
  // Add loyalty points (1 point per dollar spent)
  this.loyaltyPoints += Math.floor(amount);
  
  return this.save();
};

// Method to add favorite genre
userSchema.methods.addFavoriteGenre = function(genre) {
  if (!this.preferences.favoriteGenres.includes(genre)) {
    this.preferences.favoriteGenres.push(genre);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove favorite genre
userSchema.methods.removeFavoriteGenre = function(genre) {
  this.preferences.favoriteGenres = this.preferences.favoriteGenres.filter(g => g !== genre);
  return this.save();
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role: role, isActive: true }).sort({ createdAt: -1 });
};

// Static method to find users by loyalty tier
userSchema.statics.findByLoyaltyTier = function(tier) {
  let minPoints = 0;
  let maxPoints = Infinity;
  
  switch (tier) {
    case 'bronze':
      maxPoints = 999;
      break;
    case 'silver':
      minPoints = 1000;
      maxPoints = 4999;
      break;
    case 'gold':
      minPoints = 5000;
      maxPoints = 9999;
      break;
    case 'platinum':
      minPoints = 10000;
      break;
  }
  
  return this.find({
    loyaltyPoints: { $gte: minPoints, $lte: maxPoints },
    isActive: true
  }).sort({ loyaltyPoints: -1 });
};

// Static method to search users
userSchema.statics.searchUsers = function(query) {
  return this.find({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } }
    ],
    isActive: true
  }).sort({ createdAt: -1 });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;