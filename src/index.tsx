import { Button, CssBaseline, ThemeProvider } from '@material-ui/core';
import firebase from 'firebase/app';
import React from 'react';
import ReactDom from 'react-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { myTheme } from './theme';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAKHsNpaaePUd_MxyeOtNfb4iBmBA789jA',
  authDomain: 'memoappproject-4834f.firebaseapp.com',
  databaseURL: 'https://memoappproject-4834f.firebaseio.com',
  projectId: 'memoappproject-4834f',
  storageBucket: 'memoappproject-4834f.appspot.com',
  messagingSenderId: '749558585013',
  appId: '1:749558585013:web:666cdce1528dc3abec90fc',
  measurementId: 'G-K3RHDQK5DX',
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());

  if (loading) {
    return (
      <div>
        <p>読込中...</p>
      </div>
    );
  }

  if (error) {
    console.error(error);

    return (
      <div>
        <p>エラーが発生しました</p>
      </div>
    );
  }

  if (!user) {
    const login = async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithRedirect(provider);
    };

    return (
      <Button variant="contained" onClick={login}>
        Google Signin
      </Button>
    );
  }

  console.log(`uid = ${user.uid}でログイン中`);

  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDom.render(<App />, document.getElementById('root'));
