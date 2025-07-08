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
    this.setState({ rowsPerPage: event.target.value, page: 0 });
  };

  onFindAttr = (id, list, attr) => {
    if (!id || !list || !Array.isArray(list)) return `Not ${attr} Found`;
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    if (!reservations.length) {
      return (
        <Portlet className={rootClassName}>
          <PortletContent>
            <Typography variant="h6" align="center">
              No reservations found
            </Typography>
          </PortletContent>
        </Portlet>
      );
    }

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">User</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Total</TableCell>
                <TableCell align="left">Checkin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(reservation => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={reservation._id}>
                    <TableCell className={classes.tableCell}>
                      {reservation.username || 'N/A'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.phone || 'N/A'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.formatDate(reservation.date)}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.startAt || 'N/A'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.movieId, movies, 'title')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.onFindAttr(reservation.cinemaIds, cinemas, 'name')}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.formatCurrency(reservation.ticketPrice)}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {this.formatCurrency(reservation.total)}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Typography
                        variant="body2"
                        color={reservation.checkin ? 'primary' : 'textSecondary'}>
                        {reservation.checkin ? 'Yes' : 'No'}
                      </Typography>
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