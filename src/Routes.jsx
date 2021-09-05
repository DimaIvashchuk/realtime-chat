import React, { useContext } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import Navbar from './components/Navbar';
import { Context } from './index';
import Chat from './components/Chat';

const Routes = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  
  return (
    <BrowserRouter>
      <Navbar />
      {
        user ? 
          <Switch>
            <Route path='/room' component={Chat}/>
            <Redirect to='/room'/>
          </Switch>
          :
          <Switch>
            <Route exact path='/login' />
            <Redirect to='/login' />
          </Switch> 
      }
    </BrowserRouter>
  );
};

export default Routes;
