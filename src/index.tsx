import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'

import Btn from '@material-ui/core/Button'
import { Fab, makeStyles, Card, createMuiTheme, colors, Theme, ThemeProvider, CssBaseline, Typography, CardContent } from '@material-ui/core'
import Header from './components/Header'
import { Add } from '@material-ui/icons'
import { myTheme } from "./theme";


const useAppStyles = makeStyles((theme) => ({
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

  const classes = useAppStyles()

  return <>
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <Header />
      <div className={classes.offset} />

      <Body />

      <Fab className={classes.fab}>
        <Add />
      </Fab>
    </ThemeProvider>
  </>
}

const useBodyStyle = makeStyles((theme) => ({
  tagnames: {
    fontSize: 14,
  }
  , title: {
    marginBottom: 12,
  }
}))

function Body() {
  const [count, setCount] = useState(0)

  const classes = useBodyStyle();

  return <>
    <Card variant="outlined">
      <CardContent>
        <Typography className={classes.tagnames} color="textSecondary" gutterBottom>
          #tag
        </Typography>
        <Typography className={classes.title} variant="h5" component="h2">
          Title
        </Typography>
        <Typography variant="body2" component="p">
          メモの内容
        </Typography>
      </CardContent>
    </Card>
    <p>{count}回</p>
    <Btn variant="contained" onClick={() => setCount(count + 1)}>
      Click
    </Btn>
  </>
}

ReactDom.render(<App />, document.getElementById('root'))