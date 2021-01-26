import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { myTheme } from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import firebase from 'firebase/app';

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
  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDom.render(<App />, document.getElementById('root'));
