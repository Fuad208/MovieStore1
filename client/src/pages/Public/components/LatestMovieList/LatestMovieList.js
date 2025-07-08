import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Grid, GridList, Typography, IconButton } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import styles from './styles';
import MovieCard from '../MovieBanner/MovieBanner'; // Fixed import path

const LatestMovieList = props => {
  const { classes, movies } = props;
  const [scrollPosition, setScrollPosition] = useState(0);
  const gridListRef = useRef(null);

  // Handle scroll navigation
  const handleScroll = (direction) => {
    const container = gridListRef.current;
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Update scroll position on scroll
  const handleScrollUpdate = () => {
    if (gridListRef.current) {
      setScrollPosition(gridListRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const container = gridListRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollUpdate);
      return () => container.removeEventListener('scroll', handleScrollUpdate);
    }
  }, []);

  // Validate movies data
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h4" color="inherit" align="center">
              No movies available at the moment
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid
        className={classes.fullHeight}
        container
        alignItems="center"
        spacing={1}
      >
        <Grid item md={3} xs={12}>
          <div className={classes.title}>
            <Typography className={classes.h2} variant="h2" color="inherit">
              Latest Movies
            </Typography>
            <Typography className={classes.h4} variant="h4" color="inherit">
              Now Playing & Coming Soon
            </Typography>
            <Typography className={classes.body2} variant="body2" color="inherit">
              Discover the newest releases and upcoming blockbusters in our cinemas
            </Typography>
          </div>
        </Grid>
        
        <Grid item md={9} xs={12}>
          <div className={classes.movieListContainer}>
            {/* Navigation Buttons */}
            <div className={classes.navigationButtons}>
              <IconButton 
                className={classes.navButton}
                onClick={() => handleScroll('left')}
                disabled={scrollPosition === 0}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton 
                className={classes.navButton}
                onClick={() => handleScroll('right')}
              >
                <ChevronRight />
              </IconButton>
            </div>
            
            {/* Movie List */}
            <GridList 
              className={classes.gridList} 
              cols={2.5}
              ref={gridListRef}
            >
              {movies.map((movie, index) => (
                <div key={movie._id || index} className={classes.movieItem}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </GridList>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

LatestMovieList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired
};

LatestMovieList.defaultProps = {
  movies: []
};

export default withStyles(styles)(LatestMovieList);