const setAuthHeaders = (headersObject = {}) => {
  let headers = { ...headersObject };
  
  try {
    const token = localStorage.getItem('jwtToken');
    
    if (token && typeof token === 'string') {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
  } catch (error) {
    console.error('Error accessing localStorage for auth token:', error);
  }
  
  return headers;
};

export default setAuthHeaders;