// src/routers/RouteGuards.js
import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';

// Enhanced Protected Route with loading state
export const ProtectedRoute = ({ 
  component: Component, 
  layout: Layout, 
  layoutProps = {}, 
  adminOnly = false,
  ...rest 
}) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Simulate auth check delay
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading || isCheckingAuth) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }

        if (adminOnly && user?.role !== 'admin') {
          return <Redirect to="/" />;
        }

        const ComponentToRender = Layout ? (
          <Layout {...layoutProps}>
            <Component {...props} />
          </Layout>
        ) : (
          <Component {...props} />
        );

        return ComponentToRender;
      }}
    />
  );
};

// Enhanced Public Route with Layout
export const WithLayoutRoute = ({ 
  component: Component, 
  layout: Layout, 
  layoutProps = {},
  requireAuth = false,
  ...rest 
}) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (requireAuth && !isAuthenticated) {
          return <Redirect to="/login" />;
        }

        const ComponentToRender = Layout ? (
          <Layout {...layoutProps}>
            <Component {...props} />
          </Layout>
        ) : (
          <Component {...props} />
        );

        return ComponentToRender;
      }}
    />
  );
};

// Guest Route (redirect if authenticated)
export const GuestRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

// Route with role-based access
export const RoleBasedRoute = ({ 
  component: Component, 
  allowedRoles = [], 
  layout: Layout,
  layoutProps = {},
  ...rest 
}) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  if (loading) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
          return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
          );
        }

        const ComponentToRender = Layout ? (
          <Layout {...layoutProps}>
            <Component {...props} />
          </Layout>
        ) : (
          <Component {...props} />
        );

        return ComponentToRender;
      }}
    />
  );
};