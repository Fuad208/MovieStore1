import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Typography
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import palette from '../../../../../theme/palette';
import { options } from './chart';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(0, 0, 0, 0.54)'
  }
}));

const BestMovies = props => {
  const { className, bestMovies = [] } = props;
  const classes = useStyles();

  // Check if bestMovies is empty or invalid
  if (!bestMovies || bestMovies.length === 0) {
    return (
      <Card className={classnames(classes.root, className)}>
        <CardHeader
          action={
            <Button size="small" variant="text">
              Best 5<ArrowDropDownIcon />
            </Button>
          }
          title="Best Movies"
        />
        <Divider />
        <CardContent>
          <div className={classes.emptyState}>
            <Typography variant="h6">No data available</Typography>
            <Typography variant="body2">
              No movie reservations found to display best movies.
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: bestMovies.map(item => 
      item.movie && item.movie.title 
        ? item.movie.title.toUpperCase() 
        : 'Unknown Movie'
    ),
    datasets: [
      {
        label: 'Reservations',
        backgroundColor: palette.primary.main,
        data: bestMovies.map(item => item.count || 0)
      },
      {
        label: 'Last period',
        backgroundColor: palette.neutral || '#e0e0e0',
        data: bestMovies.map(() => Math.floor(Math.random() * 30) + 5) // Mock data for comparison
      }
    ]
  };

  return (
    <Card className={classnames(classes.root, className)}>
      <CardHeader
        action={
          <Button size="small" variant="text">
            Best 5<ArrowDropDownIcon />
          </Button>
        }
        title="Best Movies"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button color="primary" size="small" variant="text">
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

BestMovies.propTypes = {
  className: PropTypes.string,
  bestMovies: PropTypes.array
};

export default BestMovies;