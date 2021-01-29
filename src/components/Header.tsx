import {
  fade,
  AppBar,
  makeStyles,
  Toolbar,
  InputBase,
  Avatar,
  Typography,
  Popper,
  MenuItem,
  Paper,
  ClickAwayListener,
  MenuList,
} from '@material-ui/core';
import { Person, Search } from '@material-ui/icons';
import React, { RefObject, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: {
    zIndex: 1,
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
  },
  paper: {
    position: 'relative',
    zIndex: 2,
  },
}));

const Header = (prop: { user: firebase.User }): JSX.Element => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const userAvatar = (user: firebase.User | null) => {
    if (user?.photoURL != null) {
      return (
        <Avatar
          className={classes.avatar}
          src={user.photoURL}
          aria-haspopup={true}
        />
      );
    } else {
      return (
        <Avatar className={classes.avatar}>
          <Person />
        </Avatar>
      );
    }
  };

  const reff = (ref: RefObject<HTMLDivElement>) => {
    return ref ? ref : undefined;
  };

  return (
    <div className={classes.grow}>
      <AppBar className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            memoapp
          </Typography>
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
          <>
            <div ref={reff(anchorRef)} onClick={handleToggle}>
              {userAvatar(prop.user)}
            </div>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined}>
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    id="menu-list-grow"
                    autoFocusItem={open}
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={(event) => {
                        handleClose(event);
                        firebase.auth().signOut();
                        location.href = '/';
                      }}
                      key={1}
                    >
                      <Typography>Log out</Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
