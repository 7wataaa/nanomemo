import React from 'react'
import ReactDom from 'react-dom'

import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { myTheme } from "./theme";
import HomePage from './pages/HomePage'

function App() {
  return <ThemeProvider theme={myTheme}>
    <CssBaseline />
    <HomePage />
  </ThemeProvider>

}

ReactDom.render(<App />, document.getElementById('root'))