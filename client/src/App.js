import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import './components/Charts/ChartSetup';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './store/actions';

import theme from './theme';
import { Alert } from './components';
import Routes from './Routes';

import './assets/scss/index.scss';
import 'typeface-montserrat';

class App extends Component {
  componentDidMount() {
    // Load user data when app starts
    try {
      store.dispatch(loadUser());
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  componentDidCatch(error, errorInfo) {
    // Error boundary functionality
    console.error('App Error:', error, errorInfo);
    // You can add error reporting service here
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Alert />
          <Routes />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;