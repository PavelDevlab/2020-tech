
import React from 'react';
import Immutable from 'immutable';
import { Route, Redirect  } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { signedInSelector } from 'app/redux/ducks/auth';


interface AuthRoutePropTypes {
  component: React.ComponentType<{}>,
  signedIn: boolean,
  $$$targetSignedIn$$$: boolean,
  path: string
};

const defaultProps = {
  signedIn: false,
  $$$targetSignedIn$$$: false,
  children: null
};

const AuthRoute:React.FunctionComponent<AuthRoutePropTypes> = ({ signedIn, $$$targetSignedIn$$$, ...rest }) => {

  const RenderContent:any = (/*props*/) => {
    if ($$$targetSignedIn$$$) {
      return signedIn === $$$targetSignedIn$$$ ?
        rest.children :
        <Redirect to='/login' />;
    }
    if (!$$$targetSignedIn$$$) {
      return signedIn === $$$targetSignedIn$$$ ?
        rest.children :
        <Redirect to='/' />;
    }
  };

  return <Route {...{
      ...rest,
      children: <RenderContent />
  }} />;
};

AuthRoute.defaultProps = defaultProps;

export const PrivateRoute = (compose(
  connect((state:Immutable.Map<string, any>) => {
    return {
      signedIn: signedInSelector(state),
      $$$targetSignedIn$$$: true
    };
  }),
)(AuthRoute)) as any;


export const PublicRoute = (compose(
  connect((state:Immutable.Map<string, any>) => {
    return {
      signedIn: signedInSelector(state),
      $$$targetSignedIn$$$: false
    };
  }),
)(AuthRoute)) as any;