// utils/history.js
import { createBrowserHistory, createHashHistory } from 'history';

// Choose based on your deployment needs
// Hash history is better for static hosting (GitHub Pages, etc.)
// Browser history is better for server-side routing support
const createHistory = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  // Use hash history for static hosting, browser history for server-side routing
  const useHashHistory = process.env.REACT_APP_USE_HASH_HISTORY === 'true' || 
                          process.env.NODE_ENV === 'production';

  if (useHashHistory) {
    return createHashHistory({
      // Optional: customize hash type
      hashType: 'slash', // or 'noslash', 'hashbang'
    });
  } else {
    return createBrowserHistory({
      // Optional: add basename for subdirectory deployment
      basename: process.env.PUBLIC_URL || '/',
    });
  }
};

const history = createHistory();

// Add navigation helper functions
export const navigateTo = (path) => {
  if (history) {
    history.push(path);
  }
};

export const navigateBack = () => {
  if (history) {
    history.goBack();
  }
};

export const navigateForward = () => {
  if (history) {
    history.goForward();
  }
};

export const replacePath = (path) => {
  if (history) {
    history.replace(path);
  }
};

// Listen to history changes
export const listenToHistory = (callback) => {
  if (history && typeof callback === 'function') {
    return history.listen(callback);
  }
  return () => {}; // Return empty cleanup function
};

export default history;