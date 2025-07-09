export const isBrowser = () => typeof window !== 'undefined';

export const getUser = () => {
  if (!isBrowser()) return {};
  
  try {
    const userString = window.localStorage.getItem('user');
    if (!userString) return {};
    
    const user = JSON.parse(userString);
    
    // Validate user object structure
    if (typeof user !== 'object' || user === null) {
      removeUser();
      return {};
    }
    
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    removeUser();
    return {};
  }
};

export const setUser = (user) => {
  if (!isBrowser()) return;
  
  try {
    if (typeof user !== 'object' || user === null) {
      throw new Error('User must be an object');
    }
    
    window.localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user in localStorage:', error);
  }
};

export const removeUser = () => {
  if (!isBrowser()) return;
  
  try {
    window.localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

export const isLoggedIn = () => {
  const user = getUser();
  return !!(user && user.username);
};

export const getToken = () => {
  if (!isBrowser()) return null;
  
  try {
    return window.localStorage.getItem('jwtToken');
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

export const setToken = (token) => {
  if (!isBrowser()) return;
  
  try {
    if (typeof token !== 'string') {
      throw new Error('Token must be a string');
    }
    
    window.localStorage.setItem('jwtToken', token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

export const removeToken = () => {
  if (!isBrowser()) return;
  
  try {
    window.localStorage.removeItem('jwtToken');
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};