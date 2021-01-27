import { Button, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link, Redirect } from 'react-router-dom';

const useLoginPageStyles = makeStyles(() => ({
  loginpage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1ch',
  },
  btn: {},
}));

export default function LoginPage(): JSX.Element {
  const [user, setUser] = useState<firebase.User | null>(null);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const classes = useLoginPageStyles();

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  };

  const logout = () => {
    firebase.auth().signOut();
  };

  if (user) {
    console.log('user が存在するので/にリダイレクト');
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.loginpage}>
      {firebase.auth().currentUser == null ? (
        <Button className={classes.btn} variant="contained" onClick={login}>
          Google Signin
        </Button>
      ) : (
        <>
          <Button variant="contained" onClick={logout}>
            signOut
          </Button>
          <Link to="/">
            <Button variant="contained">HomePage</Button>
          </Link>
        </>
      )}
    </div>
  );
}
