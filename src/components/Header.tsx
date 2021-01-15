import { fade, AppBar, makeStyles, Toolbar, InputBase, Avatar, Typography } from '@material-ui/core'
import { Person, Search } from '@material-ui/icons'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  appbar: {
    alignItems: 'start',
  },
  toolbar: {
    width: '100%',
    paddingRight: '24px',
    boxSizing: 'content-box',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',

    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      width: '100%',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginLeft: 'auto',
    marginRight: '7%',
    [theme.breakpoints.up('sm')]: {
      marginRight: '50px',
    },
  }
}))

const Header = () => {

  const classes = useStyles()

  const time = Date()

  console.log(time)

  return <div className={classes.grow}>
    <AppBar className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h6' className={classes.title}>memoapp</Typography>
        <div className={classes.search}>
          <Search className={classes.searchIcon} />
          <InputBase
            placeholder="Search..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
        <Avatar className={classes.avatar}>
          <Person />
        </Avatar>
      </Toolbar>
    </AppBar>
  </div>
}

export default Header