import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import firebase from 'firebase/app';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { myTheme } from './theme';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

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

const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithRedirect(provider);
};

const createEmailSignInUser = async (email: string, password: string) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e);
  }
};

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

  console.log(`user.uid = ${user?.uid}` ?? '未ログイン状態です');

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            const user = firebase.auth().currentUser;
            return !user ? <Redirect to="/sign-in" /> : <HomePage />;
          }}
        />

        <Route
          exact
          path="/sign-in"
          render={() => (
            <SignInPage
              googleSignInFunc={googleLogin}
              isLogin={Boolean(user)}
            />
          )}
        />

        <Route
          exact
          path="/sign-up"
          render={() => (
            <SignUpPage
              googleSignInFunc={googleLogin}
              createEmailSignInUser={createEmailSignInUser}
              isLogin={Boolean(user)}
            />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

ReactDom.render(
  <>
    <MuiThemeProvider theme={myTheme}>
      <StyledThemeProvider theme={myTheme}>
        <CssBaseline />
        <App />
      </StyledThemeProvider>
    </MuiThemeProvider>
  </>,
  document.getElementById('root')
);
