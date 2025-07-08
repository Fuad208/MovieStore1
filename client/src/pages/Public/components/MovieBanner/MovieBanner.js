import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  makeStyles,
  withStyles,
  Chip,
  Skeleton
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';
import { textTruncate } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 360,
    minHeight: 480,
    margin: theme.spacing(1),
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
    }
  },
  media: {
    height: 240,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(to top, rgba(26, 26, 46, 0.8), transparent)'
    }
  },
  content: {
    flex: 1,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    alignItems: 'center'
  },
  tag: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontSize: 10,
    height: 20,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  movieTitle: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.3,
    marginBottom: theme.spacing(1),
    color: '#fff',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  descriptionText: {
    fontSize: 13,
    color: '#b8b8b8',
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.4
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    fontSize: 12,
    color: '#a0a0a0'
  },
  detailIcon: {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
    color: theme.palette.primary.main
  },
  director: {
    fontWeight: 500,
    color: '#9ac7fa'
  },
  duration: {
    fontWeight: 500
  },
  genre: {
    fontWeight: 500,
    color: '#cee4fd'
  },
  actions: {
    padding: theme.spacing(1, 2, 2, 2),
    justifyContent: 'center'
  },
  button: {
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontWeight: 600,
    fontSize: 14,
    textTransform: 'none',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)'
    }
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
    transition: 'transform 0.2s ease',
    '.MuiButton-root:hover &': {
      transform: 'translateX(4px)'
    }
  },
  loadingCard: {
    backgroundColor: '#1a1a2e',
    color: '#fff'
  }
}));

const StyledRating = withStyles({
  iconFilled: {
    color: '#ffb400',
  },
  iconEmpty: {
    color: '#555',
  },
})(Rating);

const MovieCardBanner = ({ movie, fullDescription = false, loading = false }) => {
  const classes = useStyles();
  const [imageError, setImageError] = useState(false);

  // Loading state
  if (loading) {
    return (
      <Card className={`${classes.card} ${classes.loadingCard}`}>
        <Skeleton variant="rect" height={240} />
        <CardContent className={classes.content}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
          <Skeleton variant="text" width="40%" height={16} />
        </CardContent>
        <CardActions className={classes.actions}>
          <Skeleton variant="rect" width="100%" height={40} />
        </CardActions>
      </Card>
    );
  }

  // Return null if no movie data
  if (!movie) {
    return null;
  }

  // Image fallback system
  const images = {
    'eternals': 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
    'spider-man: no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
    'avengers: infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
    'doctor strange: multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
    'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat(jpg)/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
  };

  const getImageUrl = () => {
    if (movie.image && !imageError) {
      return movie.image;
    }
    
    const movieTitle = movie.title?.toLowerCase();
    if (movieTitle && images[movieTitle]) {
      return images[movieTitle];
    }
    
    return 'https://source.unsplash.com/featured/400x600/?movie,cinema';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate rating (you can replace this with actual rating from movie data)
  const rating = movie.rating || Math.floor(Math.random() * 2) + 3; // 3-5 stars

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={getImageUrl()}
        title={movie.title || 'Movie Poster'}
        onError={handleImageError}
      />
      
      <CardContent className={classes.content}>
        {fullDescription && (
          <Box className={classes.tagContainer}>
            {movie.genre && movie.genre.split(',').slice(0, 3).map((genre, index) => (
              <Chip
                key={index}
                label={genre.trim()}
                className={classes.tag}
                size="small"
              />
            ))}
            <StyledRating
              value={rating}
              readOnly
              size="small"
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Box>
        )}
        
        <Typography className={classes.movieTitle} variant="h6">
          {movie.title || 'Unknown Movie'}
        </Typography>
        
        <Typography className={classes.descriptionText} variant="body2">
          {textTruncate(movie.description || 'No description available', 100)}
        </Typography>
        
        <div className={classes.detailRow}>
          <PersonIcon className={classes.detailIcon} />
          <Typography variant="body2" className={classes.director}>
            {movie.director || 'Unknown Director'}
          </Typography>
        </div>
        
        <div className={classes.detailRow}>
          <AccessTimeIcon className={classes.detailIcon} />
          <Typography variant="body2" className={classes.duration}>
            {movie.duration || 'N/A'} min
          </Typography>
        </div>
        
        <div className={classes.detailRow}>
          <Typography variant="body2" className={classes.genre}>
            {movie.genre || 'Unknown Genre'}
          </Typography>
        </div>
      </CardContent>
      
      <CardActions className={classes.actions}>
        <Link 
          to={`/booking/${movie._id}`} 
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            className={classes.button}
            fullWidth
          >
            Buy Tickets
            <ArrowRightAlt className={classes.buttonIcon} />
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default MovieCardBanner;