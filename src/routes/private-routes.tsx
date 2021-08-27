import { Redirect, Route, RouteProps } from 'react-router-dom';

import React from 'react';

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('personalToken');

  if (token) {
    return true;
  }

  return false;
};

const PrivateRoute: React.FC<PrivateRouteProps> = (
  props: PrivateRouteProps,
) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={routeProps => {
        return isAuthenticated() ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/GithubStarts" />
        );
      }}
    />
  );
};

export default PrivateRoute;
