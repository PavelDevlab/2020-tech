
import React, {ReactElement} from 'react';
import Immutable from 'immutable';
import { Route, RouteProps, Redirect /*, RouteComponentProps */ } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes, { InferProps } from 'prop-types';
import { signedInSelector } from 'app/redux/ducks/auth';


const propTypes = {
  component: PropTypes.element.isRequired,
  signedIn: PropTypes.bool.isRequired,
  $$$targetSignedIn$$$: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  path: PropTypes.string.isRequired,
};

const defaultProps = {
  component: React.Component,
  signedIn: false,
  $$$targetSignedIn$$$: false,
  children: null
};

type AuthRouteProps = InferProps<typeof propTypes> & RouteProps;


const AuthRoute = ({ signedIn, $$$targetSignedIn$$$, ...rest }: AuthRouteProps):ReactElement => {

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

AuthRoute.propTypes = propTypes;
AuthRoute.defaultProps = defaultProps;

export const PrivateRoute = (compose(
  connect((state:Immutable.Map<string, any>) => {
    return {
      signedIn: signedInSelector(state),
      $$$targetSignedIn$$$: true
    };
  }),
)(AuthRoute as any) as any as (typeof AuthRoute));


export const PublicRoute = (compose(
  connect((state:Immutable.Map<string, any>) => {
    return {
      signedIn: signedInSelector(state),
      $$$targetSignedIn$$$: false
    };
  }),
)(AuthRoute as any) as any as (typeof AuthRoute));