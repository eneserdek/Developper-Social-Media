import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './App.css';

const App = () => (
  <Fragment>
    <Router>
      <Navbar />
      <Route exact path='/' component={Landing} />
      <section>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </section>
    </Router>
  </Fragment>
);

export default App;
