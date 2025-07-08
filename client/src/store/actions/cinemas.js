import { GET_CINEMAS, GET_CINEMA } from '../types';
import { setAlert } from './alert';

export const uploadCinemaImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const url = `/cinemas/photo/${id}`;
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    } else {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    
    return responseData;
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    throw error;
  }
};

export const getCinemas = () => async dispatch => {
  try {
    const url = '/cinemas';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cinemas = await response.json();
    dispatch({ type: GET_CINEMAS, payload: cinemas });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getCinema = id => async dispatch => {
  try {
    const url = `/cinemas/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cinema = await response.json();
    dispatch({ type: GET_CINEMA, payload: cinema });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const createCinemas = (image, newCinema) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = '/cinemas';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCinema)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cinema = await response.json();
    dispatch(setAlert('Cinema Created', 'success', 5000));
    
    // Upload image if provided
    if (image) {
      try {
        await dispatch(uploadCinemaImage(cinema._id, image));
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }
    
    dispatch(getCinemas());
    return { status: 'success', message: 'Cinema Created' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: 'Cinema could not be created, please try again.'
    };
  }
};

export const updateCinemas = (image, cinema, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/cinemas/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cinema)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    dispatch(setAlert('Cinema Updated', 'success', 5000));
    
    // Upload image if provided
    if (image) {
      try {
        await dispatch(uploadCinemaImage(id, image));
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }
    
    return { status: 'success', message: 'Cinema Updated' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: 'Cinema could not be updated, please try again.'
    };
  }
};

export const removeCinemas = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/cinemas/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    dispatch(setAlert('Cinema Deleted', 'success', 5000));
    return { status: 'success', message: 'Cinema Removed' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return {
      status: 'error',
      message: 'Cinema could not be deleted, please try again.'
    };
  }
};

export const getCinemasUserModeling = username => async dispatch => {
  try {
    const url = `/cinemas/usermodeling/${username}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cinemas = await response.json();
    dispatch({ type: GET_CINEMAS, payload: cinemas });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};