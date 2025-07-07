import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { SearchInput, ResponsiveDialog } from '../../../../../components';
import styles from './styles';
import AddCinema from '../AddCinema/AddCinema';

class CinemaToolbar extends Component {
  state = {
    openAddDialog: false
  };

  openAddDialog = () => {
    this.setState({ openAddDialog: true });
  };

  closeAddDialog = () => {
    this.setState({ openAddDialog: false });
  };

  render() {
    const { openAddDialog } = this.state;
    const { classes, className, search, onChangeSearch } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Fragment>
        <div className={rootClassName}>
          <div className={classes.row}>
            <SearchInput
              className={classes.searchInput}
              placeholder="Search cinema"
              value={search}
              onChange={onChangeSearch}
            />
            <Button
              onClick={this.openAddDialog}
              color="primary"
              size="small"
              variant="outlined">
              Add Cinema
            </Button>
          </div>
        </div>
        <ResponsiveDialog
          id="Add-cinema"
          open={openAddDialog}
          handleClose={this.closeAddDialog}>
          <AddCinema handleClose={this.closeAddDialog} />
        </ResponsiveDialog>
      </Fragment>
    );
  }
}

CinemaToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  search: PropTypes.string.isRequired,
  onChangeSearch: PropTypes.func.isRequired
};

export default withStyles(styles)(CinemaToolbar);