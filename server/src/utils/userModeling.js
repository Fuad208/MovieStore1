const Reservation = require('../models/reservation');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');

/**
 * User Modeling Service for personalized recommendations
 */
class UserModelingService {
  constructor() {
    this.defaultWeights = {
      genre: 0.4,
      director: 0.3,
      cast: 0.3
    };
  }

  /**
   * Cinema recommendation based on user's past reservations
   * @param {Array} cinemas - All available cinemas
   * @param {string} username - User's username
   * @returns {Promise<Array>} Sorted cinema list
   */
  async getCinemaRecommendations(cinemas, username) {
    try {
      if (!username || !cinemas || cinemas.length === 0) {
        return cinemas || [];
      }

      const userReservations = await Reservation.find({ username }).lean();
      
      if (!userReservations || userReservations.length === 0) {
        return cinemas;
      }

      // Count cinema visits
      const cinemaVisitCount = {};
      userReservations.forEach(reservation => {
        const cinemaId = reservation.cinemaIds;
        if (cinemaId) {
          cinemaVisitCount[cinemaId] = (cinemaVisitCount[cinemaId] || 0) + 1;
        }
      });

      // Sort cinemas by visit frequency
      const sortedCinemaEntries = Object.entries(cinemaVisitCount)
        .sort(([, countA], [, countB]) => countB - countA);

      // Reorder cinemas array
      const recommendedCinemas = [];
      const remainingCinemas = [...cinemas];

      // Add frequently visited cinemas first
      sortedCinemaEntries.forEach(([cinemaId]) => {
        const cinemaIndex = remainingCinemas.findIndex(cinema => 
          cinema._id.toString() === cinemaId
        );
        
        if (cinemaIndex !== -1) {
          const [cinema] = remainingCinemas.splice(cinemaIndex, 1);
          recommendedCinemas.push(cinema);
        }
      });

      // Add remaining cinemas
      recommendedCinemas.push(...remainingCinemas);

      return recommendedCinemas;
    } catch (error) {
      console.error('Error in cinema user modeling:', error);
      return cinemas || [];
    }
  }

  /**
   * Movie recommendations based on user preferences
   * @param {string} username - User's username
   * @param {Object} weights - Custom weights for preferences
   * @returns {Promise<Array>} Recommended movies
   */
  async getMovieRecommendations(username, weights = this.defaultWeights) {
    try {
      if (!username) {
        return [];
      }

      const userPreferences = await this.buildUserPreferences(username);
      if (!userPreferences) {
        return await this.getAvailableMovies();
      }

      const availableMovies = await this.getAvailableMovies();
      const userReservations = await Reservation.find({ username }).lean();
      const unwatchedMovies = this.filterUnwatchedMovies(availableMovies, userReservations);

      if (unwatchedMovies.length === 0) {
        return availableMovies;
      }

      const ratedMovies = this.calculateMovieRatings(unwatchedMovies, userPreferences, weights);
      
      // Sort by rating (descending)
      ratedMovies.sort((a, b) => b.rating - a.rating);

      return ratedMovies.map(item => item.movie);
    } catch (error) {
      console.error('Error in movie user modeling:', error);
      return await this.getAvailableMovies();
    }
  }

  /**
   * Build user preferences from past reservations
   * @param {string} username - User's username
   * @returns {Promise<Object>} User preferences
   */
  async buildUserPreferences(username) {
    try {
      const userReservations = await Reservation.find({ username }).lean();
      
      if (!userReservations || userReservations.length === 0) {
        return null;
      }

      const allMovies = await Movie.find({}).lean();
      const watchedMovies = this.getWatchedMovies(userReservations, allMovies);

      if (watchedMovies.length === 0) {
        return null;
      }

      const preferences = {
        genre: {},
        director: {},
        cast: {}
      };

      watchedMovies.forEach(movie => {
        this.updatePreferences(preferences, movie);
      });

      return preferences;
    } catch (error) {
      console.error('Error building user preferences:', error);
      return null;
    }
  }

  /**
   * Update preferences based on movie data
   * @param {Object} preferences - Current preferences
   * @param {Object} movie - Movie data
   */
  updatePreferences(preferences, movie) {
    const updatePreferenceCategory = (category, value) => {
      if (!value) return;
      
      const items = value.split(',').map(item => item.trim()).filter(item => item);
      items.forEach(item => {
        preferences[category][item] = (preferences[category][item] || 0) + 1;
      });
    };

    updatePreferenceCategory('genre', movie.genre);
    updatePreferenceCategory('director', movie.director);
    updatePreferenceCategory('cast', movie.cast);
  }

  /**
   * Get watched movies from reservations
   * @param {Array} reservations - User reservations
   * @param {Array} allMovies - All movies
   * @returns {Array} Watched movies
   */
  getWatchedMovies(reservations, allMovies) {
    return reservations
      .map(reservation => {
        return allMovies.find(movie => 
          movie._id.toString() === reservation.movieId.toString()
        );
      })
      .filter(movie => movie !== undefined);
  }

  /**
   * Get available movies for booking
   * @returns {Promise<Array>} Available movies
   */
  async getAvailableMovies() {
    try {
      const allMovies = await Movie.find({}).lean();
      const today = new Date();
      
      return allMovies.filter(movie => {
        const releaseDate = new Date(movie.releaseDate);
        const endDate = new Date(movie.endDate);
        return today >= releaseDate && today <= endDate;
      });
    } catch (error) {
      console.error('Error getting available movies:', error);
      return [];
    }
  }

  /**
   * Filter unwatched movies
   * @param {Array} availableMovies - Available movies
   * @param {Array} userReservations - User reservations
   * @returns {Array} Unwatched movies
   */
  filterUnwatchedMovies(availableMovies, userReservations) {
    const watchedMovieIds = new Set(
      userReservations.map(reservation => reservation.movieId.toString())
    );

    return availableMovies.filter(movie => 
      !watchedMovieIds.has(movie._id.toString())
    );
  }

  /**
   * Calculate movie ratings based on user preferences
   * @param {Array} movies - Movies to rate
   * @param {Object} preferences - User preferences
   * @param {Object} weights - Preference weights
   * @returns {Array} Movies with ratings
   */
  calculateMovieRatings(movies, preferences, weights) {
    return movies.map(movie => {
      let totalRating = 0;

      Object.keys(preferences).forEach(category => {
        const categoryRating = this.calculateCategoryRating(
          movie[category], 
          preferences[category]
        );
        totalRating += categoryRating * (weights[category] || 0);
      });

      return {
        movie,
        rating: totalRating
      };
    }).filter(item => item.rating > 0);
  }

  /**
   * Calculate rating for a specific category
   * @param {string} movieValue - Movie's value for the category
   * @param {Object} userPreferences - User preferences for the category
   * @returns {number} Category rating
   */
  calculateCategoryRating(movieValue, userPreferences) {
    if (!movieValue || !userPreferences) return 0;

    const movieItems = movieValue.split(',').map(item => item.trim()).filter(item => item);
    let rating = 0;

    movieItems.forEach(item => {
      if (userPreferences[item]) {
        rating += userPreferences[item];
      }
    });

    return rating;
  }

  /**
   * Analyze user seat preferences
   * @param {string} username - User's username
   * @returns {Promise<Object>} Seat preferences
   */
  async analyzeSeatPreferences(username) {
    try {
      if (!username) {
        return this.getDefaultSeatPreferences();
      }

      const userReservations = await Reservation.find({ username }).lean();
      const cinemas = await Cinema.find({}).lean();

      if (!userReservations || userReservations.length === 0) {
        return this.getDefaultSeatPreferences();
      }

      const ticketCounts = [];
      const positions = { front: 0, center: 0, back: 0 };

      userReservations.forEach(reservation => {
        const cinema = cinemas.find(c => c._id.toString() === reservation.cinemaIds.toString());
        if (cinema && reservation.seats && reservation.seats.length > 0) {
          ticketCounts.push(reservation.seats.length);
          const position = this.getSeatPosition(cinema.seats.length, reservation.seats);
          positions[position]++;
        }
      });

      const avgTickets = ticketCounts.length > 0 
        ? Math.round(ticketCounts.reduce((a, b) => a + b, 0) / ticketCounts.length)
        : 1;

      return {
        numberOfTickets: Math.max(1, avgTickets),
        positions,
        totalReservations: userReservations.length
      };
    } catch (error) {
      console.error('Error analyzing seat preferences:', error);
      return this.getDefaultSeatPreferences();
    }
  }

  /**
   * Get default seat preferences
   * @returns {Object} Default preferences
   */
  getDefaultSeatPreferences() {
    return {
      numberOfTickets: 1,
      positions: { front: 0, center: 0, back: 0 },
      totalReservations: 0
    };
  }

  /**
   * Determine seat position (front, center, back)
   * @param {number} totalRows - Total rows in cinema
   * @param {Array} seats - Reserved seats
   * @returns {string} Position category
   */
  getSeatPosition(totalRows, seats) {
    if (!seats || seats.length === 0) return 'center';

    const firstSeatRow = typeof seats[0] === 'string' 
      ? parseInt(seats[0].charAt(0)) 
      : seats[0][0];

    const sectionSize = totalRows / 3;
    
    if (firstSeatRow <= sectionSize) {
      return 'front';
    } else if (firstSeatRow <= sectionSize * 2) {
      return 'center';
    } else {
      return 'back';
    }
  }
}

// Create singleton instance
const userModelingService = new UserModelingService();

// Export methods for backward compatibility
const cinemaUserModeling = (cinemas, username) => {
  return userModelingService.getCinemaRecommendations(cinemas, username);
};

const moviesUserModeling = (username, weights) => {
  return userModelingService.getMovieRecommendations(username, weights);
};

const reservationSeatsUserModeling = (username, newSeats) => {
  return userModelingService.analyzeSeatPreferences(username);
};

module.exports = {
  userModelingService,
  cinemaUserModeling,
  moviesUserModeling,
  reservationSeatsUserModeling
};