import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, CircularProgress } from '@material-ui/core';
import styles from './styles';
import { AddShowtime, ShowtimesToolbar, ShowtimesTable } from './components';
import {
  getShowtimes,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime,
  getMovies,
  getCinemas
} from '../../../store/actions';
import { ResponsiveDialog } from '../../../components';

class ShowtimeList extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    showtimes: PropTypes.array,
    selectedShowtimes: PropTypes.array,
    openDialog: PropTypes.bool,
    movies: PropTypes.array,
    cinemas: PropTypes.array,
    getShowtimes: PropTypes.func.isRequired,
    getMovies: PropTypes.func.isRequired,
    getCinemas: PropTypes.func.isRequired,
    toggleDialog: PropTypes.func.isRequired,
    selectShowtime: PropTypes.func.isRequired,
    selectAllShowtimes: PropTypes.func.isRequired,
    deleteShowtime: PropTypes.func.isRequired
  };

  static defaultProps = {
    showtimes: [],
    selectedShowtimes: [],
    movies: [],
    cinemas: [],
    openDialog: false
  };

  componentDidMount() {
    const { 
      showtimes, 
      movies, 
      cinemas, 
      getShowtimes, 
      getMovies, 
      getCinemas 
    } = this.props;
    
    if (!showtimes.length) getShowtimes();
    if (!movies.length) getMovies();
    if (!cinemas.length) getCinemas();
  }

  handleDeleteShowtime = () => {
    const { selectedShowtimes, deleteShowtime } = this.props;
    if (selectedShowtimes.length > 0) {
      selectedShowtimes.forEach(showtimeId => deleteShowtime(showtimeId));
    }
  };

  handleCloseDialog = () => {
    this.props.toggleDialog();
  };

  render() {
    const {
      classes,
      showtimes,
      selectedShowtimes,
      openDialog,
      toggleDialog,
      selectShowtime,
      selectAllShowtimes,
      movies,
      cinemas
    } = this.props;

    const isLoading = !showtimes.length && !movies.length && !cinemas.length;

    return (
      <div className={classes.root}>
        <ShowtimesToolbar
          showtimes={showtimes}
          toggleDialog={toggleDialog}
          selectedShowtimes={selectedShowtimes}
          deleteShowtime={this.handleDeleteShowtime}
        />
        <div className={classes.content}>
          {isLoading ? (
            <div className={classes.progressWrapper}>
              <CircularProgress />
            </div>
          ) : !showtimes.length ? (
            <Typography variant="h6" align="center">
              There are no showtimes available
            </Typography>
          ) : (
            <ShowtimesTable
              onSelectShowtime={selectShowtime}
              selectedShowtimes={selectedShowtimes}
              selectAllShowtimes={selectAllShowtimes}
              showtimes={showtimes}
              movies={movies}
              cinemas={cinemas}
            />
          )}
        </div>
        <ResponsiveDialog
          id="Add-showtime"
          open={openDialog}
          handleClose={this.handleCloseDialog}>
          <AddShowtime
            selectedShowtime={
              selectedShowtimes.length === 1
                ? showtimes.find(showtime => showtime._id === selectedShowtimes[0])
                : null
            }
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

const mapStateToProps = ({ showtimeState, movieState, cinemaState }) => ({
  openDialog: showtimeState.openDialog || false,
  showtimes: showtimeState.showtimes || [],
  selectedShowtimes: showtimeState.selectedShowtimes || [],
  movies: movieState.movies || [],
  cinemas: cinemaState.cinemas || []
});

const mapDispatchToProps = {
  getShowtimes,
  getMovies,
  getCinemas,
  toggleDialog,
  selectShowtime,
  selectAllShowtimes,
  deleteShowtime
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ShowtimeList));