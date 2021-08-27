import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Authentication from '../pages/authentication/authentication';
import Home from '../pages/home/home';
import Dashboard from '../pages/dashboard/dashboard';
import PrivateRoute from './private-routes';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/GithubStarts" component={Authentication} />
        <PrivateRoute exact path="/GithubStarts/home" component={Home} />
        <PrivateRoute
          exact
          path="/GithubStarts/dashboard"
          component={Dashboard}
        />
        <Redirect from="*" to="/GithubStarts" />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
