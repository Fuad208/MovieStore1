import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Typography, Button } from '@material-ui/core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import MovieCardSimple from '../MovieCardSimple/MovieCardSimple';
import styles from './styles';

const useStyles = makeStyles(styles);

function NextArrow(props) {
  const { currentSlide, slideCount, onClick } = props;
  const classes = useStyles({ currentSlide, slideCount });
  return (
    <div 
      className={classnames(classes.arrow, 'nextArrow')} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Next slide"
    >
      <ArrowForwardIos color="inherit" fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
  const { currentSlide, onClick } = props;
  const classes = useStyles({ currentSlide });
  return (
    <div 
      className={classnames(classes.arrow, 'prevArrow')} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Previous slide"
    >
      <ArrowBackIos color="inherit" fontSize="large" />
    </div>
  );
}

function MovieCarousel({ carouselClass, movies = [], title, to = null }) {
  const classes = useStyles();
  
  const settings = {
    centerMode: true,
    infinite: movies.length > 1,
    speed: 500,
    slidesToShow: Math.min(2, movies.length),
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: Math.min(3, movies.length),
          centerMode: movies.length > 3
        }
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: Math.min(2, movies.length),
          centerMode: movies.length > 2
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          centerMode: movies.length > 1
        }
      }
    ]
  };

  // Perbaikan: Jika tidak ada movies, tampilkan pesan
  if (!movies || movies.length === 0) {
    return (
      <div className={carouselClass}>
        <div className={classes.container}>
          <Typography className={classes.h2} variant="h2" color="inherit">
            {title}
          </Typography>
        </div>
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'white' }}>
          <Typography variant="h6">No movies available</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={carouselClass}>
      <div className={classes.container}>
        <Typography className={classes.h2} variant="h2" color="inherit">
          {title}
        </Typography>
        {to && (
          <Link to={to} style={{ textDecoration: 'none' }}>
            <Button className={classes.button} color="primary">
              Explore All
            </Button>
          </Link>
        )}
      </div>
      <Slider {...settings} className={classes.slider}>
        {movies.map((movie, i) => (
          <div key={movie._id || i}>
            <MovieCardSimple 
              movie={movie} 
              index={i} 
              ifupcoming={title === 'Coming Soon'} 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

// Perbaikan: Tambahkan PropTypes
MovieCarousel.propTypes = {
  carouselClass: PropTypes.string,
  movies: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  to: PropTypes.string
};

MovieCarousel.defaultProps = {
  carouselClass: '',
  movies: [],
  to: null
};

export default MovieCarousel;