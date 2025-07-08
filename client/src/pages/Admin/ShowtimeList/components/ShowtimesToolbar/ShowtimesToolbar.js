import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, IconButton, Tooltip, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import styles from './styles';

class ShowtimesToolbar extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedShowtimes: PropTypes.array,
    showtimes: PropTypes.array,
    toggleDialog: PropTypes.func.isRequired,
    deleteShowtime: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedShowtimes: [],
    showtimes: []
  };

  handleDeleteClick = () => {
    const { selectedShowtimes, deleteShowtime } = this.props;
    if (selectedShowtimes.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedShowtimes.length} showtime(s)?`)) {
        deleteShowtime();
      }
    }
  };

  getButtonText = () => {
    const { selectedShowtimes } = this.props;
    if (selectedShowtimes.length === 1) {
      return 'Edit Showtime';
    }
    return 'Add Showtime';
  };

  getButtonIcon = () => {
    const { selectedShowtimes } = this.props;
    if (selectedShowtimes.length === 1) {
      return <EditIcon />;
    }
    return <AddIcon />;
  };

  render() {
    const {
      classes,
      className,
      selectedShowtimes,
      showtimes,
      toggleDialog
    } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <div className={classes.title}>
            <Typography variant="h4">
              Showtimes Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {showtimes.length} total showtime(s)
              {selectedShowtimes.length > 0 && ` • ${selectedShowtimes.length} selected`}
            </Typography>
          </div>
          
          <div className={classes.actions}>
            {selectedShowtimes.length > 0 && (
              <Tooltip title={`Delete ${selectedShowtimes.length} showtime(s)`}>
                <IconButton
                  className={classes.deleteButton}
                  onClick={this.handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            <Button
              onClick={() => toggleDialog()}
              color="primary"
              variant="contained"
              startIcon={this.getButtonIcon()}
              disabled={selectedShowtimes.length > 1}>
              {this.getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ShowtimesToolbar);