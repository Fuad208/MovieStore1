// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import { getMovie, onSelectMovie } from '../../../store/actions';

class MoviePage extends Component {
  componentDidMount() {
    const { match, getMovie } = this.props;
    if (match && match.params && match.params.id) {
      getMovie(match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.onSelectMovie(null);
  }

  render() {
    const { movie, match } = this.props;
    
    // Handle loading state
    if (!movie) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading movie...</p>
        </div>
      );
    }

    // Handle error state when movie ID doesn't match
    if (match && match.params && match.params.id && movie.id !== match.params.id) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading movie...</p>
        </div>
      );
    }

    return (
      <>
        {movie && <MovieBanner movie={movie} fullDescription />}
      </>
    );
  }
}

MoviePage.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  movie: PropTypes.object,
  getMovie: PropTypes.func.isRequired,
  onSelectMovie: PropTypes.func.isRequired
};

const mapStateToProps = ({ movieState }) => ({
  movie: movieState.selectedMovie
});

const mapDispatchToProps = { getMovie, onSelectMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoviePage);