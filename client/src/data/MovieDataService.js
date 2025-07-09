export const genreData = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'historical',
  'horror',
  'mystery',
  'romance',
  'science fiction',
  'thriller',
  'political',
  'western'
];

export const languageData = [
  "English",
  "Indonesian", // Fixed typo
  "Korean",
  "Japanese",
  "German",
  "Greek",
  "French" // Fixed typo
];

// Add a proper service class
export class MovieDataService {
  static getGenres() {
    return genreData;
  }

  static getLanguages() {
    return languageData;
  }

  static isValidGenre(genre) {
    return genreData.includes(genre.toLowerCase());
  }

  static isValidLanguage(language) {
    return languageData.includes(language);
  }
}

export default MovieDataService;