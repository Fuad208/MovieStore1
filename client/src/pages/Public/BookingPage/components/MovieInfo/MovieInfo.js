import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Box, Skeleton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  movieInfos: {
    background: 'linear-gradient(135deg, rgba(57, 61, 67, 0.8), rgba(30, 30, 30, 0.9))',
    position: 'relative',
    height: '100%',
    minHeight: '400px',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: theme.shadows[4]
  },
  background: {
    position: 'absolute',
    opacity: 0.3,
    top: 0,
    height: '70%',
    right: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    zIndex: 1,
    transition: 'opacity 0.3s ease-in-out',
    '&:hover': {
      opacity: 0.5
    }
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
    zIndex: 2
  },
  title: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: theme.palette.common.white,
    fontSize: '28px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    zIndex: 3,
    padding: theme.spacing(0, 2),
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
  },
  info: {
    position: 'absolute',
    padding: theme.spacing(3),
    top: '70%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    overflowY: 'auto'
  },
  infoBox: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0
    }
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(0.5)
  },
  infoValue: {
    fontSize: '13px',
    lineHeight: 1.4,
    color: theme.palette.common.white,
    opacity: 0.9
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '400px',
    color: theme.palette.common.white
  },
  fallbackImage: {
    backgroundColor: theme.palette.grey[800],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    fontSize: '16px'
  },
  [theme.breakpoints.down('md')]: {
    movieInfos: { 
      minHeight: '300px' 
    },
    background: { 
      height: '100%' 
    },
    title: { 
      top: '75%',
      fontSize: '24px'
    },
    info: { 
      top: '85%',
      padding: theme.spacing(2)
    }
  },
  [theme.breakpoints.down('sm')]: {
    movieInfos: { 
      minHeight: '250px' 
    },
    title: { 
      top: '80%',
      fontSize: '20px'
    },
    info: { 
      display: 'none' 
    }
  }
}));

// Default images untuk film
const DEFAULT_IMAGES = {
  'eternals': 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
  'spider man-no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
  'avengers-infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
  'doctor strange-multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
  'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
};

export default function MovieInfo(props) {
  const classes = useStyles();
  const { movie, loading = false } = props;

  // Loading state
  if (loading) {
    return (
      <Grid item xs={12} md={12} lg={3}>
        <Box className={classes.movieInfos}>
          <div className={classes.loadingContainer}>
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Box mt={2}>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={150} height={20} />
            </Box>
          </div>
        </Box>
      </Grid>
    );
  }

  // No movie data
  if (!movie) {
    return (
      <Grid item xs={12} md={12} lg={3}>
        <Box className={classes.movieInfos}>
          <div className={classes.loadingContainer}>
            <Typography variant="h6" align="center">
              No movie information available
            </Typography>
          </div>
        </Box>
      </Grid>
    );
  }

  // Get movie image
  const getMovieImage = () => {
    const movieTitle = movie.title?.toLowerCase() || '';
    return movie.image || 
           DEFAULT_IMAGES[movieTitle] || 
           movie.poster || 
           null;
  };

  const movieImage = getMovieImage();

  return (
    <Grid item xs={12} md={12} lg={3}>
      <div className={classes.movieInfos}>
        {movieImage ? (
          <div
            className={classes.background}
            style={{
              backgroundImage: `url(${movieImage})`
            }}
          />
        ) : (
          <div className={`${classes.background} ${classes.fallbackImage}`}>
            <Typography variant="body2">
              No Image Available
            </Typography>
          </div>
        )}
        
        <div className={classes.overlay} />
        
        <Typography className={classes.title}>
          {movie.title || 'Unknown Movie'}
        </Typography>
        
        <div className={classes.info}>
          {movie.director && (
            <div className={classes.infoBox}>
              <Typography variant="subtitle2" className={classes.infoLabel}>
                Director
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {movie.director}
              </Typography>
            </div>
          )}
          
          {movie.cast && (
            <div className={classes.infoBox}>
              <Typography variant="subtitle2" className={classes.infoLabel}>
                Cast
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {movie.cast}
              </Typography>
            </div>
          )}
          
          {movie.genre && (
            <div className={classes.infoBox}>
              <Typography variant="subtitle2" className={classes.infoLabel}>
                Genre
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {movie.genre}
              </Typography>
            </div>
          )}
          
          {movie.duration && (
            <div className={classes.infoBox}>
              <Typography variant="subtitle2" className={classes.infoLabel}>
                Duration
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {movie.duration}
              </Typography>
            </div>
          )}
          
          {movie.rating && (
            <div className={classes.infoBox}>
              <Typography variant="subtitle2" className={classes.infoLabel}>
                Rating
              </Typography>
              <Typography variant="body2" className={classes.infoValue}>
                {movie.rating}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
}