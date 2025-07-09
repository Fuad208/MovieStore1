// theme/palette.js
import { red, blue, blueGrey, yellow, green } from '@mui/material/colors';
const white = '#FFF';
const black = '#000';

export default {
  mode: 'light', // Updated from 'type' to 'mode' for MUI v5
  common: {
    black,
    white,
    commonBackground: white,
    contrastText: black,
    neutral: '#E4E7EB',
    muted: '#9EA0A4'
  },
  default: {
    light: 'rgba(41, 150, 243, .1)',
    main: 'rgba(0, 40, 73, .9)',
    dark: 'rgb(0, 40, 73)',
    logoBg: 'rgb(51, 51, 51)',
    border: 'rgba(0, 40, 73, .1)',
    contrastText: white
  },
  primary: {
    contrastText: white,
    main: '#0767DB',
    light: '#F6F9FD',
    dark: '#0B48A0'
  },
  secondary: {
    contrastText: white,
    main: '#7d58ff',
    light: '#bb86fc',
    dark: '#37248F'
  },
  success: {
    light: green[300],
    main: green[500],
    dark: green[700],
    contrastText: white
  },
  info: {
    light: blue[300],
    main: blue[500],
    dark: blue[700],
    contrastText: white
  },
  warning: {
    light: yellow[300],
    main: yellow[500],
    dark: yellow[700],
    contrastText: black // Better contrast for warning
  },
  error: { // Changed from 'danger' to 'error' for MUI v5
    light: red[300],
    main: red[500],
    dark: red[700],
    contrastText: white
  },
  text: {
    primary: blueGrey[900],
    secondary: blueGrey[600],
    disabled: blueGrey[400],
    hint: blueGrey[400]
  },
  background: {
    default: '#f8fafc',
    paper: white
  },
  divider: '#DFE3E8',
  // Custom colors maintained
  oxfordBlue: 'rgba(5, 41, 73, 1)',
  prussianBlue: 'rgba(19, 49, 92, 1)',
  darkCerulean: 'rgba(19, 64, 116, 1)',
  pewterBlue: 'rgba(141, 169, 196, 1)',
  isabelline: 'rgba(238, 244, 237, 1)'
};