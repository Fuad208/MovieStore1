import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import styles from './styles';
import { 
  addShowtime, 
  updateShowtime, 
  toggleDialog,
  getMovies,
  getCinemas
} from '../../../../../store/actions';

class AddShowtime extends Component {
  state = {
    startAt: '',
    startDate: null,
    endDate: null,
    movieId: '',
    cinemaIds: '',
    errors: {}
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedShowtime: PropTypes.object,
    nowShowing: PropTypes.array,
    movies: PropTypes.array,
    cinemas: PropTypes.array,
    addShowtime: PropTypes.func.isRequired,
    updateShowtime: PropTypes.func.isRequired,
    toggleDialog: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedShowtime: null,
    nowShowing: [],
    movies: [],
    cinemas: []
  };

  componentDidMount() {
    const { movies, cinemas, getMovies, getCinemas } = this.props;
    
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();

    if (this.props.selectedShowtime) {
      const {
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaIds
      } = this.props.selectedShowtime;
      
      this.setState({
        startAt: startAt || '',
        startDate: startDate ? moment(startDate).toDate() : null,
        endDate: endDate ? moment(endDate).toDate() : null,
        movieId: movieId || '',
        cinemaIds: cinemaIds || ''
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedShowtime !== this.props.selectedShowtime && this.props.selectedShowtime) {
      const {
        startAt,
        startDate,
        endDate,
        movieId,
        cinemaIds
      } = this.props.selectedShowtime;
      
      this.setState({
        startAt: startAt || '',
        startDate: startDate ? moment(startDate).toDate() : null,
        endDate: endDate ? moment(endDate).toDate() : null,
        movieId: movieId || '',
        cinemaIds: cinemaIds || ''
      });
    }
  }

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
      errors: {
        ...this.state.errors,
        [field]: null
      }
    });
  };

  validateForm = () => {
    const { startAt, startDate, endDate, movieId, cinemaIds } = this.state;
    const errors = {};

    if (!startAt) errors.startAt = 'Start time is required';
    if (!startDate) errors.startDate = 'Start date is required';
    if (!endDate) errors.endDate = 'End date is required';
    if (!movieId) errors.movieId = 'Movie is required';
    if (!cinemaIds) errors.cinemaIds = 'Cinema is required';

    if (startDate && endDate && moment(startDate).isAfter(endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onAddShowtime = () => {
    if (!this.validateForm()) return;

    const { startAt, startDate, endDate, movieId, cinemaIds } = this.state;
    const showtime = {
      startAt,
      startDate: moment(startDate).toISOString(),
      endDate: moment(endDate).toISOString(),
      movieId,
      cinemaIds
    };
    
    this.props.addShowtime(showtime);
    this.resetForm();
    this.props.toggleDialog();
  };

  onUpdateShowtime = () => {
    if (!this.validateForm()) return;

    const { startAt, startDate, endDate, movieId, cinemaIds } = this.state;
    const showtime = {
      startAt,
      startDate: moment(startDate).toISOString(),
      endDate: moment(endDate).toISOString(),
      movieId,
      cinemaIds
    };
    
    this.props.updateShowtime(showtime, this.props.selectedShowtime._id);
    this.resetForm();
    this.props.toggleDialog();
  };

  resetForm = () => {
    this.setState({
      startAt: '',
      startDate: null,
      endDate: null,
      movieId: '',
      cinemaIds: '',
      errors: {}
    });
  };

  onFilterMinDate = () => {
    const { nowShowing } = this.props;
    const { movieId } = this.state;
    
    if (!movieId || !nowShowing.length) return new Date();
    
    const selectedMovie = nowShowing.find(movie => movie._id === movieId);
    if (selectedMovie && selectedMovie.startDate) {
      return moment(selectedMovie.startDate).toDate();
    }
    return new Date();
  };

  onFilterMaxDate = () => {
    const { nowShowing } = this.props;
    const { movieId } = this.state;
    
    if (!movieId || !nowShowing.length) return null;
    
    const selectedMovie = nowShowing.find(movie => movie._id === movieId);
    if (selectedMovie && selectedMovie.endDate) {
      return moment(selectedMovie.endDate).toDate();
    }
    return null;
  };

  render() {
    const { movies, cinemas, classes, className } = this.props;
    const { startAt, startDate, endDate, movieId, cinemaIds, errors } = this.state;

    const rootClassName = classNames(classes.root, className);
    const title = this.props.selectedShowtime ? 'Edit Showtime' : 'Add Showtime';
    const submitButton = this.props.selectedShowtime ? 'Update Showtime' : 'Save Details';
    const submitAction = this.props.selectedShowtime ? this.onUpdateShowtime : this.onAddShowtime;

    const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText={errors.startAt || "Please specify the time"}
              label="Start Time"
              margin="dense"
              required
              error={!!errors.startAt}
              value={startAt}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('startAt', event.target.value)
              }>
              {timeSlots.map(time => (
                <MenuItem key={`time-${time}`} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </div>
          
          <div className={classes.field}>
            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText={errors.movieId || "Please select a movie"}
              label="Movie"
              margin="dense"
              required
              error={!!errors.movieId}
              value={movieId}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('movieId', event.target.value)
              }>
              {movies.map(movie => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              className={classes.textField}
              helperText={errors.cinemaIds || "Please select a cinema"}
              label="Cinema"
              margin="dense"
              required
              error={!!errors.cinemaIds}
              value={cinemaIds}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('cinemaIds', event.target.value)
              }>
              {cinemas.map(cinema => (
                <MenuItem key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="start-date"
                label="Start Date"
                format="DD/MM/YYYY"
                minDate={this.onFilterMinDate()}
                maxDate={this.onFilterMaxDate()}
                value={startDate}
                error={!!errors.startDate}
                helperText={errors.startDate}
                onChange={date => this.handleFieldChange('startDate', date ? date.toDate() : null)}
                KeyboardButtonProps={{
                  'aria-label': 'change start date'
                }}
              />

              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="End Date"
                format="DD/MM/YYYY"
                minDate={startDate ? moment(startDate).toDate() : new Date()}
                maxDate={this.onFilterMaxDate()}
                value={endDate}
                error={!!errors.endDate}
                helperText={errors.endDate}
                onChange={date => this.handleFieldChange('endDate', date ? date.toDate() : null)}
                KeyboardButtonProps={{
                  'aria-label': 'change end date'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </form>

        <div className={classes.buttonContainer}>
          <Button
            className={classes.buttonFooter}
            onClick={() => this.props.toggleDialog()}
            variant="outlined">
            Cancel
          </Button>
          <Button
            className={classes.buttonFooter}
            color="primary"
            variant="contained"
            onClick={submitAction}>
            {submitButton}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ movieState, cinemaState }) => ({
  movies: movieState.movies || [],
  nowShowing: movieState.nowShowing || [],
  cinemas: cinemaState.cinemas || []
});

const mapDispatchToProps = { 
  addShowtime, 
  updateShowtime, 
  toggleDialog,
  getMovies,
  getCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddShowtime));