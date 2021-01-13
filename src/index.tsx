import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'

import Btn from '@material-ui/core/Button'
import { Fab, makeStyles, Card, createMuiTheme, colors, Theme, ThemeProvider } from '@material-ui/core'
import Header from './components/Header'
import { Add } from '@material-ui/icons'



const useStyles = makeStyles((theme) => ({
  offset: {
    ...theme.mixins.toolbar,
    //flexGrow: 1,
  },
  fab: {
    margin: '0px',
    top: 'auto',
    right: '50px',
    bottom: '25px',
    left: 'auto',
    position: 'fixed',
  },
}))

function App() {
  useEffect(() => {
    console.log('123')
  })

  const classes = useStyles()

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#273944'
      }
    }
  })

  return <>
    <ThemeProvider theme={theme}>
      <Header />
      <div className={classes.offset} />

      <Body />

      <Fab className={classes.fab}>
        <Add />
      </Fab>
    </ThemeProvider>
  </>
}

function Body() {
  const [count, setCount] = useState(0)

  return <>
    <Card>a</Card>
    <p>{count}回</p>
    <Btn variant="contained" onClick={() => setCount(count + 1)}>
      Click
    </Btn>
  </>
}

ReactDom.render(
  <App />,
  document.getElementById('root')
)