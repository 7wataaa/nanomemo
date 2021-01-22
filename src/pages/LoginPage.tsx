import { Button, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Link, Redirect } from 'react-router-dom'

const useLoginPageStyles = makeStyles((theme) => ({
  loginpage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1ch',
  },
  btn: {
  }
}))

function LoginPage() {
  const [user, setUser] = useState<firebase.User | null>(null)


  firebase.auth().onAuthStateChanged(user => {
    setUser(user);
    console.log(user?.uid ?? 'uid == null')
  });


  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }

  const classes = useLoginPageStyles()

  if (firebase.auth().currentUser == null) {
    return <div className={classes.loginpage}>
      <p>ログインしてないよ</p>
      <Button className={classes.btn} variant="contained" onClick={login}>Google Signin</Button>
    </div>
  }

  return <Redirect to="/"></Redirect>
}

export default LoginPage