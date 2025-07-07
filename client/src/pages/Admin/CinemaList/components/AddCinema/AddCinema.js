import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField, Typography } from '@material-ui/core';
import styles from './styles';
import { Add } from '@material-ui/icons';
import {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
} from '../../../../../store/actions';
import { FileUpload } from '../../../../../components';

class AddCinema extends Component {
  state = {
    _id: '',
    name: '',
    image: null,
    ticketPrice: '',
    city: '',
    seatsAvailable: '',
    seats: [],
    notification: {},
    loading: false,
    errors: {}
  };

  componentDidMount() {
    if (this.props.editCinema) {
      const { image, ...rest } = this.props.editCinema;
      this.setState({ ...rest });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.editCinema !== this.props.editCinema && this.props.editCinema) {
      const { image, ...rest } = this.props.editCinema;
      this.setState({ ...rest });
    }
  }

  handleFieldChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: null } // Clear error when user types
    });
  };

  validateForm = () => {
    const { name, city, ticketPrice, seatsAvailable } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Cinema name is required';
    }

    if (!city.trim()) {
      errors.city = 'City is required';
    }

    if (!ticketPrice || ticketPrice <= 0) {
      errors.ticketPrice = 'Valid ticket price is required';
    }

    if (!seatsAvailable || seatsAvailable <= 0) {
      errors.seatsAvailable = 'Seats available must be greater than 0';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  onSubmitAction = async (type) => {
    if (type !== 'remove' && !this.validateForm()) {
      return;
    }

    this.setState({ loading: true });

    try {
      const {
        getCinemas,
        createCinemas,
        updateCinemas,
        removeCinemas
      } = this.props;
      
      const {
        _id,
        name,
        image,
        ticketPrice,
        city,
        seatsAvailable,
        seats
      } = this.state;

      const cinema = { 
        name: name.trim(), 
        ticketPrice: Number(ticketPrice), 
        city: city.trim(), 
        seatsAvailable: Number(seatsAvailable), 
        seats 
      };

      let notification = {};

      if (type === 'create') {
        notification = await createCinemas(image, cinema);
      } else if (type === 'update') {
        notification = await updateCinemas(image, cinema, _id);
      } else if (type === 'remove') {
        notification = await removeCinemas(_id);
      }

      this.setState({ notification });

      if (notification && notification.status === 'success') {
        await getCinemas();
        if (this.props.handleClose) {
          setTimeout(() => this.props.handleClose(), 1000); // Close dialog after success
        }
      }
    } catch (error) {
      console.error('Cinema operation error:', error);
      this.setState({ 
        notification: { 
          status: 'error', 
          message: error.message || 'An error occurred' 
        }
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSeatsChange = (index, value) => {
    const numValue = parseInt(value, 10);
    if (numValue > 10 || numValue < 0) return;
    
    const { seats } = this.state;
    const newSeats = [...seats];
    newSeats[index] = Array.from({ length: numValue }, () => 0);
    this.setState({ seats: newSeats });
  };

  onAddSeatRow = () => {
    this.setState(prevState => ({
      seats: [...prevState.seats, []]
    }));
  };

  onRemoveSeatRow = (index) => {
    this.setState(prevState => ({
      seats: prevState.seats.filter((_, i) => i !== index)
    }));
  };

  renderSeatFields = () => {
    const { seats } = this.state;
    const { classes } = this.props;
    
    return (
      <>
        <div className={classes.field}>
          <Button onClick={this.onAddSeatRow} disabled={this.state.loading}>
            <Add /> Add Seat Row
          </Button>
        </div>
        {seats.length > 0 &&
          seats.map((seat, index) => (
            <div key={`seat-${index}`} className={classes.field}>
              <TextField
                className={classes.textField}
                label={`Seats in row ${(index + 10).toString(36).toUpperCase()}`}
                margin="dense"
                required
                value={seat.length}
                variant="outlined"
                type="number"
                inputProps={{
                  min: 0,
                  max: 10
                }}
                onChange={event =>
                  this.handleSeatsChange(index, event.target.value)
                }
              />
              <Button 
                color="secondary" 
                onClick={() => this.onRemoveSeatRow(index)}
                disabled={this.state.loading}>
                Remove
              </Button>
            </div>
          ))}
      </>
    );
  };

  render() {
    const { classes, className } = this.props;
    const {
      name,
      image,
      ticketPrice,
      city,
      seatsAvailable,
      notification,
      loading,
      errors
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const mainTitle = this.props.editCinema ? 'Edit Cinema' : 'Add Cinema';
    const submitButton = this.props.editCinema
      ? 'Update Cinema'
      : 'Save Details';
    const submitAction = this.props.editCinema
      ? () => this.onSubmitAction('update')
      : () => this.onSubmitAction('create');

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {mainTitle}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText={errors.name || "Please specify the cinema name"}
              label="Cinema Name"
              margin="dense"
              required
              value={name}
              variant="outlined"
              error={!!errors.name}
              onChange={event =>
                this.handleFieldChange('name', event.target.value)
              }
            />

            <TextField
              className={classes.textField}
              helperText={errors.city || "Please specify the city"}
              label="City"
              margin="dense"
              required
              variant="outlined"
              value={city}
              error={!!errors.city}
              onChange={event =>
                this.handleFieldChange('city', event.target.value)
              }
            />
          </div>
          
          <div className={classes.field}>
            <FileUpload
              className={classes.textField}
              file={image}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </div>

          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText={errors.ticketPrice || "Enter ticket price"}
              label="Ticket Price"
              margin="dense"
              type="number"
              value={ticketPrice}
              variant="outlined"
              error={!!errors.ticketPrice}
              inputProps={{ min: 0, step: 0.01 }}
              onChange={event =>
                this.handleFieldChange('ticketPrice', event.target.value)
              }
            />
            <TextField
              className={classes.textField}
              helperText={errors.seatsAvailable || "Enter total seats available"}
              label="Total Seats Available"
              margin="dense"
              type="number"
              required
              value={seatsAvailable}
              variant="outlined"
              error={!!errors.seatsAvailable}
              inputProps={{ min: 0 }}
              onChange={event =>
                this.handleFieldChange('seatsAvailable', event.target.value)
              }
            />
          </div>
          
          {this.renderSeatFields()}
        </form>

        <div className={classes.buttonContainer}>
          <Button
            className={classes.buttonFooter}
            color="primary"
            variant="contained"
            onClick={submitAction}
            disabled={loading}>
            {loading ? 'Processing...' : submitButton}
          </Button>
          
          {this.props.editCinema && (
            <Button
              color="secondary"
              className={classes.buttonFooter}
              variant="contained"
              onClick={() => this.onSubmitAction('remove')}
              disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Cinema'}
            </Button>
          )}
        </div>

        {notification && notification.status && (
          <Typography
            className={classes.infoMessage}
            color={notification.status === 'success' ? 'primary' : 'error'}
            variant="caption">
            {notification.message}
          </Typography>
        )}
      </div>
    );
  }
}

AddCinema.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  editCinema: PropTypes.object,
  handleClose: PropTypes.func
};

const mapStateToProps = null;
const mapDispatchToProps = {
  getCinemas,
  createCinemas,
  updateCinemas,
  removeCinemas
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddCinema));