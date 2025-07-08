import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const WithLayoutRoute = props => {
  const { layout: Layout, component: Component, layoutProps, ...rest } = props;

  // Validate required props
  if (!Component) {
    console.error('WithLayoutRoute: component prop is required');
    return null;
  }

  if (!Layout) {
    console.error('WithLayoutRoute: layout prop is required');
    return null;
  }

  return (
    <Route
      {...rest}
      render={matchProps => {
        try {
          // Render component with layout
          return (
            <Layout {...layoutProps}>
              <Component {...matchProps} />
            </Layout>
          );
        } catch (error) {
          console.error('WithLayoutRoute: Error rendering component:', error);
          return (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <h2 style={{ color: '#666', marginBottom: '10px' }}>
                Something went wrong
              </h2>
              <p style={{ color: '#999', margin: '0' }}>
                Please try refreshing the page
              </p>
            </div>
          );
        }
      }}
    />
  );
};

WithLayoutRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.elementType
  ]).isRequired,
  layout: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.elementType
  ]).isRequired,
  layoutProps: PropTypes.object,
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool
};

WithLayoutRoute.defaultProps = {
  layoutProps: {},
  exact: false,
  strict: false,
  sensitive: false
};

export default WithLayoutRoute;