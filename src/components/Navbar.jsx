import React, { useContext } from 'react';
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarFixedAdjust,
  TopAppBarTitle
} from '@rmwc/top-app-bar';
import { Button } from '@rmwc/button';

import { Context } from '../index';


const Navbar = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  const login = () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  return (
    <>
      <TopAppBar>
      <TopAppBarRow>
        <TopAppBarSection>
          <TopAppBarTitle>Chat</TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection>
          {
            !user && <Button style={{ backgroundColor: '#ae00c5' }} label="Login" raised onClick={login} />
          }
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
    <TopAppBarFixedAdjust />
    </>
  );
};

export default Navbar;
