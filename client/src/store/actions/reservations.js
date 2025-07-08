import { GET_RESERVATIONS, GET_RESERVATION_SUGGESTED_SEATS } from '../types';
import { setAlert } from './alert';

export const getReservations = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reservations = await response.json();
    dispatch({ type: GET_RESERVATIONS, payload: reservations });
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch reservations';
    dispatch(setAlert(errorMessage, 'error', 5000));
  }
};

export const getSuggestedReservationSeats = username => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/reservations/usermodeling/${username}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reservationSeats = await response.json();
    dispatch({
      type: GET_RESERVATION_SUGGESTED_SEATS,
      payload: reservationSeats
    });
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch suggested seats';
    dispatch(setAlert(errorMessage, 'error', 5000));
  }
};

export const addReservation = reservation => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });

    const resData = await response.json();

    if (response.ok && resData.reservation) {
      const { reservation: createdReservation, QRCode } = resData;
      dispatch(setAlert('Reservation created successfully', 'success', 5000));
      return {
        status: 'success',
        message: 'Reservation created successfully',
        data: { reservation: createdReservation, QRCode }
      };
    } else {
      const errorMessage = resData.message || 'Failed to create reservation';
      dispatch(setAlert(errorMessage, 'error', 5000));
      return {
        status: 'error',
        message: errorMessage
      };
    }
  } catch (error) {
    const errorMessage = error.message || 'System error occurred while creating reservation';
    dispatch(setAlert(errorMessage, 'error', 5000));
    return {
      status: 'error',
      message: errorMessage
    };
  }
};

export const updateReservation = (reservation, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/reservations/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });

    const resData = await response.json();

    if (response.ok) {
      dispatch(setAlert('Reservation updated successfully', 'success', 5000));
      return { status: 'success', message: 'Reservation updated successfully' };
    } else {
      const errorMessage = resData.message || 'Failed to update reservation';
      dispatch(setAlert(errorMessage, 'error', 5000));
      return {
        status: 'error',
        message: errorMessage
      };
    }
  } catch (error) {
    const errorMessage = error.message || 'System error occurred while updating reservation';
    dispatch(setAlert(errorMessage, 'error', 5000));
    return {
      status: 'error',
      message: errorMessage
    };
  }
};

export const removeReservation = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = `/reservations/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const resData = await response.json();
      const errorMessage = resData.message || 'Failed to delete reservation';
      dispatch(setAlert(errorMessage, 'error', 5000));
      return {
        status: 'error',
        message: errorMessage
      };
    }

    dispatch(setAlert('Reservation deleted successfully', 'success', 5000));
    return { status: 'success', message: 'Reservation deleted successfully' };
  } catch (error) {
    const errorMessage = error.message || 'System error occurred while deleting reservation';
    dispatch(setAlert(errorMessage, 'error', 5000));
    return {
      status: 'error',
      message: errorMessage
    };
  }
};