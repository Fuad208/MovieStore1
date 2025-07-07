import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCinemas } from '../../../store/actions';
import { withStyles } from '@material-ui/core';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { AddCinema, CinemaToolbar } from './components';
import { ResponsiveDialog } from '../../../components';
import styles from './styles';
import CinemaCard from '../../Public/components/CinemaCard/CinemaCard';
import { match } from '../../../utils';

class CinemaList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCinema: null,
      openEditDialog: false,
      search: '',
      loading: false,
      error: null
    };
  }

  async componentDidMount() {
    const { cinemas, getCinemas } = this.props;
    if (!cinemas.length) {
      this.setState({ loading: true });
      try {
        await getCinemas();
      } catch (error) {
        this.setState({ error: 'Failed to load cinemas' });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  openEditDialog = (cinema) => {
    this.setState({ openEditDialog: true, editCinema: cinema });
  };

  closeEditDialog = () => {
    this.setState({ openEditDialog: false, editCinema: null });
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  renderContent = () => {
    const { cinemas } = this.props;
    const { search, loading, error } = this.state;

    if (loading) {
      return (
        <div className={this.props.classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      );
    }

    if (!cinemas.length) {
      return (
        <Typography variant="h6" align="center">
          No cinemas found. Add your first cinema to get started.
        </Typography>
      );
    }

    const filteredCinemas = match(search, cinemas, 'name');

    if (search && !filteredCinemas.length) {
      return (
        <Typography variant="h6" align="center">
          No cinemas found matching "{search}".
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredCinemas.map(cinema => (
          <Grid
            item
            key={cinema._id}
            lg={4}
            md={6}
            xs={12}
            onClick={() => this.openEditDialog(cinema)}
            style={{ cursor: 'pointer' }}>
            <CinemaCard cinema={cinema} />
          </Grid>
        ))}
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    const { editCinema, openEditDialog, search } = this.state;

    return (
      <div className={classes.root}>
        <CinemaToolbar
          search={search}
          onChangeSearch={this.handleSearchChange}
        />
        <div className={classes.content}>
          {this.renderContent()}
        </div>
        <ResponsiveDialog
          id="Edit-cinema"
          open={openEditDialog}
          handleClose={this.closeEditDialog}>
          <AddCinema
            editCinema={editCinema}
            handleClose={this.closeEditDialog}
          />
        </ResponsiveDialog>
      </div>
    );
  }
}

CinemaList.propTypes = {
  classes: PropTypes.object.isRequired,
  cinemas: PropTypes.array.isRequired,
  getCinemas: PropTypes.func.isRequired
};

const mapStateToProps = ({ cinemaState }) => ({
  cinemas: cinemaState.cinemas || []
});

const mapDispatchToProps = { getCinemas };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CinemaList));