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
      light: '#ffffff',
      main: '#ede7f6',
      dark: '#bbb5c3',
      contrastText: '#000000',
    },
    background: {
      default: '#E9ECEF',
    },
  },
});
