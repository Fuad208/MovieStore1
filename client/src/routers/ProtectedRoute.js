import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ProtectedRoute = ({
  layout: Layout,
  component: Component,
  isAuthenticated,
  redirectTo = '/login',
  ...rest
}) => {
  // Validate required props
  if (!Component) {
    console.error('ProtectedRoute: component prop is required');
    return null;
  }

  if (!Layout) {
    console.error('ProtectedRoute: layout prop is required');
    return null;
  }

  return (
    <Route
      {...rest}
      render={props => {
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Redirect to login page while preserving the intended location
          return (
            <Redirect 
              to={{ 
                pathname: redirectTo, 
                state: { from: props.location } 
              }} 
            />
          );
        }

        // User is authenticated, render the component with layout
        try {
          return (
            <Layout>
              <Component {...props} />
            </Layout>
          );
        } catch (error) {
          console.error('ProtectedRoute: Error rendering component:', error);
          return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Something went wrong</h2>
              <p>Please try refreshing the page</p>
            </div>
          );
        }
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  layout: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  isAuthenticated: PropTypes.bool,
  redirectTo: PropTypes.string,
  path: PropTypes.string,
  exact: PropTypes.bool
};

ProtectedRoute.defaultProps = {
  isAuthenticated: false,
  redirectTo: '/login',
  exact: false
};

const mapStateToProps = state => {
  // Handle case where authState might not exist
  const authState = state.authState || {};
  return {
    isAuthenticated: Boolean(authState.isAuthenticated)
  };
};

export default connect(mapStateToProps)(ProtectedRoute);