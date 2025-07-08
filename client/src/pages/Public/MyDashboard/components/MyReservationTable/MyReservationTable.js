import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography
} from '@material-ui/core';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {}
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ 
      rowsPerPage: event.target.value,
      page: 0 // Reset to first page when changing rows per page
    });
  };

  onFindAttr = (id, list, attr) => {
    if (!id || !Array.isArray(list)) {
      return `Not ${attr} Found`;
    }
    
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      return 'N/A';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    // Validate data
    if (!Array.isArray(reservations) || reservations.length === 0) {
      return (
        <Portlet className={rootClassName}>
          <PortletContent>
            <Typography variant="h6" align="center" color="textSecondary">
              No reservations found
            </Typography>
          </PortletContent>
        </Portlet>
      );
    }

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedReservations = reservations.slice(startIndex, endIndex);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReservations.map(reservation => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={reservation._id || reservation.id}>
                  <TableCell className={classes.tableCell}>
                    {this.onFindAttr(reservation.movieId, movies, 'title')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.onFindAttr(reservation.cinemaId || reservation.cinemaIds, cinemas, 'name')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.formatDate(reservation.date)}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {reservation.startAt || 'N/A'}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.formatCurrency(reservation.ticketPrice)}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.formatCurrency(reservation.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={reservations.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(ReservationsTable);