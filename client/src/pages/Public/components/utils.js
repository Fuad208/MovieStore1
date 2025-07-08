// utils/index.js atau file utility terpisah

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of text (default: 100)
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const textTruncate = (text, maxLength = 100) => {
  // Handle null, undefined, or non-string inputs
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Return original text if it's already short enough
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If there's a space, cut at the last space; otherwise, cut at maxLength
  const finalText = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;
  
  return finalText + '...';
};

/**
 * Additional utility functions for movie data handling
 */

/**
 * Format duration from minutes to readable format
 * @param {number|string} duration - Duration in minutes
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (duration) => {
  if (!duration) return 'Duration not available';
  
  const minutes = parseInt(duration, 10);
  if (isNaN(minutes)) return 'Duration not available';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

/**
 * Validate movie object structure
 * @param {object} movie - Movie object to validate
 * @returns {boolean} - True if valid movie object
 */
export const isValidMovie = (movie) => {
  return movie && 
         typeof movie === 'object' && 
         movie._id && 
         typeof movie._id === 'string' &&
         movie._id.trim() !== '';
};

/**
 * Get safe movie property with fallback
 * @param {object} movie - Movie object
 * @param {string} property - Property name
 * @param {string} fallback - Fallback value
 * @returns {string} - Property value or fallback
 */
export const getMovieProperty = (movie, property, fallback = 'Not available') => {
  if (!movie || !movie[property]) {
    return fallback;
  }
  return typeof movie[property] === 'string' ? movie[property].trim() : movie[property];
};