
import React from 'react';

import { Route, Redirect  } from 'react-router';
import { compose } from 'app/services/utils';
import { connect, ConnectedProps } from 'react-redux';
import { StoreRecord } from 'app/redux/reducer';

import { signedInSelector } from 'app/redux/ducks/auth';

const connectorPrivate = connect((state: StoreRecord) => {
  return {
    signedIn: signedInSelector(state),
    $$$targetSignedIn$$$: true
  };
});

const connectorPublic = connect((state: StoreRecord) => {
  return {
    signedIn: signedInSelector(state),
    $$$targetSignedIn$$$: false
  };
});

type AuthRoutePropTypes = ConnectedProps<typeof connectorPrivate> & {
  children: React.ReactElement | React.ReactElement[]
  path: string
};

const AuthRoute:React.FunctionComponent<AuthRoutePropTypes> = ({ signedIn, $$$targetSignedIn$$$, ...rest }) => {

  const RenderAuthContent:any = (/*props*/) => {
    if ($$$targetSignedIn$$$) {
      return signedIn === $$$targetSignedIn$$$ ?
        rest.children :
        <Redirect to='/login' />;
    }
    return signedIn === $$$targetSignedIn$$$ ?
      rest.children :
      <Redirect to='/' />;
  };

  return <Route {...{
      ...rest,
      children: <RenderAuthContent />
  }} />;
};

export const PrivateRoute = compose(
    connectorPrivate,
)(AuthRoute);


export const PublicRoute = compose(
    connectorPublic,
)(AuthRoute);