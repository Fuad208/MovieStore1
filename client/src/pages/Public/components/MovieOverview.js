import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  ButtonBase,
  makeStyles,
  Box
} from '@material-ui/core';

// A style sheet
const useStyles = makeStyles(theme => ({
  image: {
    height: 400,
    width: 400,
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.02)',
      transition: 'transform 0.3s ease-in-out'
    }
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover'
  },
  label: { 
    width: 120, 
    height: 'auto', 
    overflow: 'hidden',
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
    minWidth: 120
  },
  statsContainer: {
    marginTop: theme.spacing(2)
  },
  statItem: {
    marginBottom: theme.spacing(1)
  },
  title: {
    textTransform: 'capitalize',
    marginBottom: theme.spacing(2)
  },
  description: {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6
  },
  movieId: {
    opacity: 0.7,
    fontSize: '0.875rem'
  },
  [theme.breakpoints.down('md')]: {
    image: {
      height: 300,
      width: 300
    }
  },
  [theme.breakpoints.down('sm')]: {
    image: {
      height: 250,
      width: 250
    },
    label: {
      width: 100,
      minWidth: 100
    }
  }
}));

const Stats = ({ stats, classes }) => {
  if (!stats || stats.length === 0) {
    return (
      <Typography color="inherit" variant="body2">
        No additional information available
      </Typography>
    );
  }

  return (
    <Box className={classes.statsContainer}>
      {stats.map((stat, index) => (
        <Box 
          key={`${stat.label}-${index}`} 
          display="flex" 
          alignItems="center"
          className={classes.statItem}
        >
          <Typography
            className={classes.label}
            color="inherit"
            variant="subtitle1">
            {stat.label}:
          </Typography>
          <Typography color="inherit" variant="body2">
            {stat.value || 'Not available'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MovieOverview = ({ 
  title, 
  description, 
  image, 
  movieId,
  releaseDate,
  runtime,
  director,
  genre,
  status,
  language,
  cast,
  rating
}) => {
  const classes = useStyles();
  
  // Perbaikan: Tambahkan fallback image dan normalisasi title
  const images = {
    'eternals': 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
    'spider man-no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
    'avengers-infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
    'doctor strange-multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
    'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
  };

  // Perbaikan: Fungsi untuk mendapatkan image dengan fallback
  const getMovieImage = (imageUrl, movieTitle) => {
    if (imageUrl) return imageUrl;
    
    if (movieTitle) {
      const normalizedTitle = movieTitle.toLowerCase().trim();
      return images[normalizedTitle] || 'https://via.placeholder.com/400x400?text=No+Image';
    }
    
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  // Perbaikan: Format runtime jika dalam menit
  const formatRuntime = (runtime) => {
    if (!runtime) return 'Runtime not available';
    
    // Jika sudah dalam format string yang benar
    if (typeof runtime === 'string' && runtime.includes('h')) {
      return runtime;
    }
    
    // Jika dalam menit, konversi ke jam dan menit
    const minutes = parseInt(runtime, 10);
    if (isNaN(minutes)) return 'Runtime not available';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  // Perbaikan: Buat stats dari props yang diterima
  const movieStats = [
    { label: 'Released', value: releaseDate },
    { label: 'Runtime', value: formatRuntime(runtime) },
    { label: 'Director', value: director },
    { label: 'Genre', value: genre },
    { label: 'Status', value: status },
    { label: 'Language', value: language }
  ];

  // Tambahkan cast dan rating jika tersedia
  if (cast) {
    movieStats.push({ label: 'Cast', value: cast });
  }
  if (rating) {
    movieStats.push({ label: 'Rating', value: rating });
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={4}>
        <ButtonBase className={classes.image}>
          <img 
            className={classes.img} 
            alt={title || 'Movie poster'}
            src={getMovieImage(image, title)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
            }}
          />
        </ButtonBase>
      </Grid>
      <Grid item xs={12} md={8} container direction="column" spacing={2}>
        <Grid item>
          <Typography 
            color="inherit" 
            gutterBottom 
            variant="h2"
            className={classes.title}
          >
            {title || 'Untitled Movie'}
          </Typography>
          <Typography 
            color="inherit" 
            variant="body1" 
            className={classes.description}
          >
            {description || 'No description available for this movie.'}
          </Typography>
          {movieId && (
            <Typography 
              variant="body2" 
              className={classes.movieId}
              color="textSecondary"
            >
              ID: {movieId}
            </Typography>
          )}
          <Box height={20} />
        </Grid>
        <Grid item xs>
          <Stats
            classes={classes}
            stats={movieStats}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

// Perbaikan: Tambahkan PropTypes
MovieOverview.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  releaseDate: PropTypes.string,
  runtime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  director: PropTypes.string,
  genre: PropTypes.string,
  status: PropTypes.string,
  language: PropTypes.string,
  cast: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

MovieOverview.defaultProps = {
  title: 'Untitled Movie',
  description: 'No description available',
  image: null,
  movieId: null,
  releaseDate: 'Release date not available',
  runtime: 'Runtime not available',
  director: 'Director not available',
  genre: 'Genre not specified',
  status: 'Status unknown',
  language: 'Language not specified',
  cast: null,
  rating: null
};

Stats.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  classes: PropTypes.object.isRequired
};

export default MovieOverview;