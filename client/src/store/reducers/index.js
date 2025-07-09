import { combineReducers } from 'redux';
import alertReducer from './alert';
import authReducer from './auth';
import checkoutReducer from './checkout';
import cinemasReducer from './cinemas';
import moviesReducer from './movies';
import reservationsReducer from './reservations';
import showtimesReducer from './showtimes';
import usersReducer from './users';

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  checkout: checkoutReducer,
  cinemas: cinemasReducer,
  movies: moviesReducer,
  reservations: reservationsReducer,
  showtimes: showtimesReducer,
  users: usersReducer
});

export default rootReducer;