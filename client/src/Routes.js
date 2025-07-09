import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Loading from './components/Loading';
import { ProtectedRoute, WithLayoutRoute } from './routers';
import { AdminLayout, PublicLayout } from './layouts';

// Admin Pages - Lazy loaded for better performance
const DashboardPage = lazy(() => import('./pages/Admin/Dashboard'));
const MovieList = lazy(() => import('./pages/Admin/MovieList'));
const CinemaList = lazy(() => import('./pages/Admin/CinemaList'));
const ShowtimeList = lazy(() => import('./pages/Admin/ShowtimeList'));
const ReservationList = lazy(() => import('./pages/Admin/ReservationList'));
const User = lazy(() => import('./pages/Admin/User'));
const Account = lazy(() => import('./pages/Admin/Account'));

// Auth Pages
const Register = lazy(() => import('./pages/Public/Register'));
const Login = lazy(() => import('./pages/Public/Login'));

// Public Pages
const HomePage = lazy(() => import('./pages/Public/HomePage'));
const MoviePage = lazy(() => import('./pages/Public/MoviePage'));
const MyDashboard = lazy(() => import('./pages/Public/MyDashboard'));
const MovieCategoryPage = lazy(() => import('./pages/Public/MovieCategoryPage'));
const CinemasPage = lazy(() => import('./pages/Public/CinemasPage'));
const BookingPage = lazy(() => import('./pages/Public/BookingPage'));
const Checkin = lazy(() => import('./pages/Public/Checkin'));

// 404 Page Component
const NotFoundPage = () => (
  <div style={{ 
    textAlign: 'center', 
    padding: '50px', 
    fontSize: '24px',
    color: '#666'
  }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
      Go back to home
    </a>
  </div>
);

const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>
          {/* Auth Routes */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          
          {/* Public Routes */}
          <WithLayoutRoute
            exact
            path="/"
            layout={PublicLayout}
            component={HomePage}
          />
          
          <WithLayoutRoute
            exact
            path="/mydashboard"
            layout={PublicLayout}
            component={MyDashboard}
          />
          
          <WithLayoutRoute
            exact
            path="/cinemas"
            layout={PublicLayout}
            component={CinemasPage}
          />
          
          <WithLayoutRoute
            exact
            path="/movie/category/:category"
            layout={PublicLayout}
            component={MovieCategoryPage}
          />
          
          <WithLayoutRoute
            exact
            path="/movie/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={MoviePage}
          />
          
          {/* Booking Routes - Consolidated for better organization */}
          <WithLayoutRoute
            exact
            path="/booking/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={BookingPage}
          />
          
          {/* Legacy booking route - redirect to new route */}
          <Route 
            exact 
            path="/movie/booking/:id" 
            render={({ match }) => (
              <Redirect to={`/booking/${match.params.id}`} />
            )}
          />
          
          <WithLayoutRoute
            exact
            path="/checkin/:reservationId"
            layout={PublicLayout}
            component={Checkin}
          />

          {/* Admin Routes */}
          <ProtectedRoute
            exact
            path="/admin"
            layout={AdminLayout}
            component={() => <Redirect to="/admin/dashboard" />}
          />
          
          <ProtectedRoute
            exact
            path="/admin/dashboard"
            layout={AdminLayout}
            component={DashboardPage}
          />
          
          <ProtectedRoute
            exact
            path="/admin/users"
            layout={AdminLayout}
            component={User}
          />
          
          <ProtectedRoute
            exact
            path="/admin/showtimes"
            layout={AdminLayout}
            component={ShowtimeList}
          />
          
          <ProtectedRoute
            exact
            path="/admin/reservations"
            layout={AdminLayout}
            component={ReservationList}
          />
          
          <ProtectedRoute
            exact
            path="/admin/cinemas"
            layout={AdminLayout}
            component={CinemaList}
          />
          
          <ProtectedRoute
            exact
            path="/admin/movies"
            layout={AdminLayout}
            component={MovieList}
          />
          
          <ProtectedRoute
            exact
            path="/admin/account"
            layout={AdminLayout}
            component={Account}
          />

          {/* 404 fallback */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default Routes;