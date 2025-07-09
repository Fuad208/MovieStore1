export const textTruncate = (text, length = 100, ending = '...') => {
  // Input validation
  if (typeof text !== 'string') {
    return '';
  }
  
  if (typeof length !== 'number' || length <= 0) {
    length = 100;
  }
  
  if (typeof ending !== 'string') {
    ending = '...';
  }
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length - ending.length) + ending;
};

export const match = (term, array, key) => {
  // Input validation
  if (!term || typeof term !== 'string') {
    return [];
  }
  
  if (!Array.isArray(array)) {
    return [];
  }
  
  if (!key || typeof key !== 'string') {
    return [];
  }
  
  try {
    const reg = new RegExp(term.split('').join('.*'), 'i');
    return array.filter(item => {
      return item && 
             typeof item === 'object' && 
             item[key] && 
             typeof item[key] === 'string' && 
             item[key].match(reg);
    });
  } catch (error) {
    console.error('Error in match function:', error);
    return [];
  }
};

// Additional utility functions
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

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};