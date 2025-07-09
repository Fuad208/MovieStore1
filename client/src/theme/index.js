import { createTheme } from '@mui/material/styles'; // Updated import
import paletteDark from './paletteDark';
import typography from './typography';

const theme = createTheme({
  palette: paletteDark,
  typography,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  },
  topBar: {
    height: '56px'
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;