import { GET_MOVIES, SELECT_MOVIE, GET_SUGGESTIONS } from '../types';
import { setAlert } from './alert';

export const uploadMovieImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const data = new FormData();
    data.append('file', image);
    const url = `/movies/photo/${id}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    } else {
      dispatch(setAlert('Movie image uploaded successfully', 'success', 5000));
    }
    
    return responseData;
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    throw error;
  }
};

export const getMovies = () => async dispatch => {
  try {
    const url = '/movies';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const movies = await response.json();
    dispatch({ type: GET_MOVIES, payload: movies });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectMovie = movie => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovie = id => async dispatch => {
  try {
    const url = `/movies/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const movie = await response.json();
    dispatch({ type: SELECT_MOVIE, payload: movie });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovieSuggestion = id => async dispatch => {
  try {
    const url = `/movies/usermodeling/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const movies = await response.json();
    dispatch({ type: GET_SUGGESTIONS, payload: movies });
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addMovie = (image, newMovie) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = '/movies';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const movie = await response.json();
    dispatch(setAlert('Movie has been saved successfully', 'success', 5000));
    
    // Upload image if provided
    if (image) {
      try {
        await dispatch(uploadMovieImage(movie._id, image));
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }
    
    dispatch(getMovies());
    return { status: 'success', message: 'Movie created successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: 'Failed to create movie' };
  }
};

export const updateMovie = (movieId, movie, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/movies/${movieId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    dispatch(onSelectMovie(null));
    dispatch(setAlert('Movie has been updated successfully', 'success', 5000));
    
    // Upload image if provided
    if (image) {
      try {
        await dispatch(uploadMovieImage(movieId, image));
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }
    
    dispatch(getMovies());
    return { status: 'success', message: 'Movie updated successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: 'Failed to update movie' };
  }
};

export const removeMovie = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/movies/${movieId}`;
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
    
    dispatch(getMovies());
    dispatch(onSelectMovie(null));
    dispatch(setAlert('Movie has been deleted successfully', 'success', 5000));
    return { status: 'success', message: 'Movie deleted successfully' };
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
    return { status: 'error', message: 'Failed to delete movie' };
  }
};