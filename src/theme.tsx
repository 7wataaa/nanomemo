import { createMuiTheme } from '@material-ui/core/styles';

export const myTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#37474f',
    },
    background: {
      default: '#E9ECEF',
    },
  },
});
