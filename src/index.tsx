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
  let userCredentialResult;

  try {
    userCredentialResult = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  } catch (e) {
    const errorCode = e.code;

    switch (errorCode) {
      case 'auth/email-already-in-use':
        alert(
          'このメールアドレスはすでに使用されています。別のメールアドレスをご使用ください。'
        );
        break;

      case 'auth/invalid-email':
        alert(
          'このメールアドレスは無効です。正しいメールアドレスをご使用ください。'
        );
        break;

      case 'auth/operation-not-allowed':
        alert('メールアドレス認証は現在使用できません。');
        break;

      case 'auth/weak-password':
        alert(
          'パスワードを変更してやり直してください。攻撃に対して脆弱な可能性があります。'
        );
        break;
    }

    console.log(e);
  }

  return userCredentialResult?.user ?? null;
};

const emailAndPasswordSignIn = async (email: string, password: string) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (e) {
    const errorCode = e.code;

    switch (errorCode) {
      //TODO alertじゃなくする
      case 'auth/invalid-email':
        alert(
          'このメールアドレスは無効です。正しいメールアドレスをご使用ください。'
        );
        break;

      case 'auth/user-disabled':
        alert('このアカウントは使用できません。');
        break;

      case 'auth/user-not-found':
        alert('メールアドレスまたはパスワードが間違っています。');
        break;

      case 'auth/wrong-password':
        alert('メールアドレスまたはパスワードが間違っています。');
        break;
    }

    console.log(e);
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
              emailAndPasswordSignInFunc={emailAndPasswordSignIn}
              authUser={user}
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
              authUser={user}
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
