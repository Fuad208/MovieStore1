import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadUser, logout } from '../store/actions/authActions';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, user, loading]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
};