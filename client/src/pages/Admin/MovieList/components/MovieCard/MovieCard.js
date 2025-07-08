import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import { Paper } from '../../../../../components';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    paddingBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    }
  },
  imageWrapper: {
    height: '200px',
    margin: '0 auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[200]
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600]
  },
  details: { 
    padding: theme.spacing(3) 
  },
  title: {
    fontSize: '18px',
    lineHeight: '21px',
    marginTop: theme.spacing(1),
    textTransform: 'capitalize',
    fontWeight: 'bold'
  },
  description: {
    lineHeight: '16px',
    height: theme.spacing(4),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(3)
  },
  updateIcon: {
    color: theme.palette.text.secondary,
    fontSize: '16px'
  },
  updateText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  genre: {
    fontSize: '12px',
    color: theme.palette.primary.main,
    marginTop: theme.spacing(0.5),
    textTransform: 'uppercase'
  }
}));

// Default/placeholder images for movies
const defaultImages = {
  'eternals': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Eternals',
  'spider-man': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Spider-Man',
  'avengers': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Avengers',
  'doctor strange': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Doctor+Strange',
  'black panther': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Black+Panther',
  'default': 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Movie+Poster'
};

function MovieCard(props) {
  const classes = useStyles(props);
  const { className, movie } = props;

  if (!movie) {
    return null;
  }

  const rootClassName = classNames(classes.root, className);
  
  // Get image source with fallback
  const getImageSource = () => {
    if (movie.image) {
      return movie.image;
    }
    
    // Try to find a matching default image
    const movieTitle = (movie.title || '').toLowerCase();
    const matchingKey = Object.keys(defaultImages).find(key => 
      key !== 'default' && movieTitle.includes(key)
    );
    
    return matchingKey ? defaultImages[matchingKey] : defaultImages.default;
  };

  const handleImageError = (e) => {
    e.target.src = defaultImages.default;
  };

  return (
    <Paper className={rootClassName}>
      <div className={classes.imageWrapper}>
        {movie.image || true ? (
          <img 
            alt={movie.title || 'Movie poster'} 
            className={classes.image} 
            src={getImageSource()}
            onError={handleImageError}
          />
        ) : (
          <div className={classes.placeholderImage}>
            <Typography variant="body2">No Image</Typography>
          </div>
        )}
      </div>
      
      <div className={classes.details}>
        <Typography className={classes.title} variant="h5">
          {movie.title || 'Untitled Movie'}
        </Typography>
        
        {movie.genre && (
          <Typography className={classes.genre} variant="caption">
            {movie.genre}
          </Typography>
        )}
        
        <Typography className={classes.description} variant="body2">
          {movie.description || 'No description available'}
        </Typography>
      </div>
      
      <div className={classes.stats}>
        <AccessTimeIcon className={classes.updateIcon} />
        <Typography className={classes.updateText} variant="body2">
          {movie.duration ? `${movie.duration} minutes` : 'Duration not specified'}
        </Typography>
      </div>
    </Paper>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    genre: PropTypes.string
  }).isRequired,
  className: PropTypes.string
};

export default MovieCard;