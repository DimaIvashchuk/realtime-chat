import React, { createContext } from 'react';
import { render } from 'react-dom';
import firebase from 'firebase';

import './style.css';
import '@rmwc/button/styles';
import '@rmwc/top-app-bar/styles';
import '@rmwc/textfield/styles';
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/formfield/styles';

import UserRoutes from './Routes';

export const Context = createContext(null);

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

const auth = firebase.auth();
const db = firebase.firestore()

render(
  <Context.Provider value={{
    auth,
    db
  }}>
    <UserRoutes />
  </Context.Provider>,
  document.getElementById('root')
);

