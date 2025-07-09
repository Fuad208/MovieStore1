// src/utils/performance.js
// Performance optimization utilities

// Preload critical routes
export const preloadRoutes = () => {
  // Preload most commonly accessed routes
  const criticalRoutes = [
    () => import('../pages/Public/HomePage'),
    () => import('../pages/Public/MoviePage'),
    () => import('../pages/Public/BookingPage'),
  ];

  // Preload after initial render
  setTimeout(() => {
    criticalRoutes.forEach(route => {
      route().catch(() => {
        // Ignore preload errors
      });
    });
  }, 2000);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Lazy load images
export const lazyLoadImage = (src, placeholder = '/assets/placeholder.png') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder);
    img.src = src;
  });
};

// Memory cleanup utilities
export const cleanupListeners = (listeners) => {
  listeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
};

// Optimize Redux store subscriptions
export const createOptimizedSelector = (selector) => {
  let lastResult;
  let lastArgs;
  
  return (...args) => {
    if (lastArgs && args.every((arg, index) => arg === lastArgs[index])) {
      return lastResult;
    }
    
    lastArgs = args;
    lastResult = selector(...args);
    return lastResult;
  };
};