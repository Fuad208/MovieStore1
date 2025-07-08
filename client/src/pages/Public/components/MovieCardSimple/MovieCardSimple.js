import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 0,
    color: theme.palette.common.white,
    boxShadow: 'unset',
    margin: '0 auto',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.3s ease-in-out'
    }
  },
  media: {
    height: 300,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  h5: {
    textTransform: 'capitalize'
  },
  cardContent: {
    padding: theme.spacing(2)
  }
}));

const MovieCardSimple = props => {
  const classes = useStyles();
  const { movie, index, ifupcoming } = props;
  
  // Perbaikan: Tambahkan fallback image dan normalisasi title
  const images = {
    'eternals': 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
    'spider man-no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
    'avengers-infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
    'doctor strange-multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
    'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
  };

  // Perbaikan: Fungsi untuk mendapatkan image dengan fallback
  const getMovieImage = (title) => {
    if (!title) return 'https://via.placeholder.com/400x300?text=No+Image';
    const normalizedTitle = title.toLowerCase().trim();
    return images[normalizedTitle] || 'https://via.placeholder.com/400x300?text=No+Image';
  };

  // Perbaikan: Validasi data movie
  if (!movie || !movie._id) {
    return null;
  }

  return (
    <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none' }}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={getMovieImage(movie.title)}
            title={movie.title || 'Movie'}
            onError={(e) => {
              e.target.style.backgroundImage = 'url(https://via.placeholder.com/400x300?text=Image+Not+Found)';
            }}
          />
          <CardContent className={classes.cardContent}>
            <Typography
              className={classes.h5}
              gutterBottom
              variant="h5"
              component="h2"
              color="inherit">
              {movie.title || 'Untitled Movie'}
            </Typography>
            {ifupcoming && (
              <Typography variant="body2" color="inherit">
                Coming Soon
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

MovieCardSimple.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string
  }).isRequired,
  index: PropTypes.number,
  ifupcoming: PropTypes.bool
};

MovieCardSimple.defaultProps = {
  index: 0,
  ifupcoming: false
};

export default MovieCardSimple;