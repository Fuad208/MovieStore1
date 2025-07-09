import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header>
      <div>Welcome, {user.name}</div>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default Header;