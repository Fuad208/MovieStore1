import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { Portlet, PortletContent } from '../../../../../components';
import styles from './styles';

class ShowtimesTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelectShowtime: PropTypes.func.isRequired,
    selectedShowtimes: PropTypes.array,
    selectAllShowtimes: PropTypes.func.isRequired,
    showtimes: PropTypes.array.isRequired,
    movies: PropTypes.array,
    cinemas: PropTypes.array
  };

  static defaultProps = {
    selectedShowtimes: [],
    showtimes: [],
    movies: [],
    cinemas: []
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
  };

  findItemById = (id, list, attribute) => {
    if (!id || !list || !Array.isArray(list)) return 'N/A';
    const item = list.find(item => item._id === id);
    return item && item[attribute] ? item[attribute] : 'N/A';
  };

  formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return moment(dateString).format('DD/MM/YYYY');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  render() {
    const {
      classes,
      className,
      showtimes,
      onSelectShowtime,
      selectedShowtimes,
      selectAllShowtimes,
      movies,
      cinemas
    } = this.props;
    const { rowsPerPage, page } = this.state;

    const rootClassName = classNames(classes.root, className);
    
    const paginatedShowtimes = showtimes.slice(
      page * rowsPerPage, 
      page * rowsPerPage + rowsPerPage
    );

    if (!showtimes.length) {
      return (
        <Portlet className={rootClassName}>
          <PortletContent>
            <Typography variant="h6" align="center">
              No showtimes available
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
                <TableCell align="left">
                  <Checkbox
                    checked={
                      showtimes.length > 0 && 
                      selectedShowtimes.length === showtimes.length
                    }
                    color="primary"
                    indeterminate={
                      selectedShowtimes.length > 0 &&
                      selectedShowtimes.length < showtimes.length
                    }
                    onChange={selectAllShowtimes}
                  />
                  ID
                </TableCell>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Cinema</TableCell>
                <TableCell align="left">Start Date</TableCell>
                <TableCell align="left">End Date</TableCell>
                <TableCell align="left">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedShowtimes.map(showtime => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={showtime._id}
                  selected={selectedShowtimes.indexOf(showtime._id) !== -1}>
                  <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellInner}>
                      <Checkbox
                        checked={selectedShowtimes.indexOf(showtime._id) !== -1}
                        color="primary"
                        onChange={() => onSelectShowtime(showtime._id)}
                      />
                      <Typography
                        className={classes.nameText}
                        variant="body2"
                        title={showtime._id}>
                        {showtime._id.substring(0, 8)}...
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="body2">
                      {this.findItemById(showtime.movieId, movies, 'title')}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="body2">
                      {this.findItemById(showtime.cinemaIds, cinemas, 'name')}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="body2">
                      {this.formatDate(showtime.startDate)}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="body2">
                      {this.formatDate(showtime.endDate)}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="body2" className={classes.timeText}>
                      {showtime.startAt || 'N/A'}
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
            count={showtimes.length}
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

export default withStyles(styles)(ShowtimesTable);