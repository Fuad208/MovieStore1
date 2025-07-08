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

class UsersTable extends Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    selectedUsers: PropTypes.array.isRequired
  };

  static defaultProps = {
    users: [],
    selectedUsers: []
  };

  state = {
    rowsPerPage: 10,
    page: 0
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ 
      rowsPerPage: event.target.value,
      page: 0 // Reset ke halaman pertama ketika rows per page berubah
    });
  };

  handleSelectAllUsers = event => {
    const { users, onSelectAll } = this.props;
    const { page, rowsPerPage } = this.state;
    
    // Get users yang ditampilkan di halaman saat ini
    const displayedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    onSelectAll(event.target.checked ? displayedUsers.map(user => user._id) : []);
  };

  isUserSelected = userId => {
    return this.props.selectedUsers.indexOf(userId) !== -1;
  };

  render() {
    const {
      classes,
      className,
      users,
      selectedUsers,
      onSelect
    } = this.props;
    const { rowsPerPage, page } = this.state;

    const rootClassName = classNames(classes.root, className);
    
    // Paginasi yang benar
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);
    
    // Cek apakah semua user yang ditampilkan sudah dipilih
    const isAllSelected = displayedUsers.length > 0 && 
      displayedUsers.every(user => this.isUserSelected(user._id));
    
    const isIndeterminate = displayedUsers.some(user => this.isUserSelected(user._id)) && 
      !isAllSelected;

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Checkbox
                    checked={isAllSelected}
                    color="primary"
                    indeterminate={isIndeterminate}
                    onChange={this.handleSelectAllUsers}
                  />
                  Name
                </TableCell>
                <TableCell align="left">Username</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.map(user => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={user._id}
                  selected={this.isUserSelected(user._id)}
                >
                  <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellInner}>
                      <Checkbox
                        checked={this.isUserSelected(user._id)}
                        color="primary"
                        onChange={() => onSelect(user._id)}
                        value="true"
                      />
                      <Typography
                        className={classes.nameText}
                        variant="body1"
                      >
                        {user.name || 'N/A'}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.username || 'N/A'}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.email || 'N/A'}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Typography
                      variant="body2"
                      style={{ 
                        textTransform: 'capitalize',
                        color: user.role === 'admin' ? '#f44336' : '#4caf50'
                      }}
                    >
                      {user.role || 'guest'}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.phone || 'N/A'}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.createdAt ? moment(user.createdAt).format('DD/MM/YYYY') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Paginasi hanya ditampilkan jika ada data */}
          {users.length > 0 && (
            <TablePagination
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              component="div"
              count={users.length}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(UsersTable);