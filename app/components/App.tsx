import React, { ReactElement } from 'react';
import AppLayout from 'components/AppLayout';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';
import { signedInSelector } from 'app/redux/ducks/auth';
import Immutable from 'immutable';

import MainPage from './MainPage';
import NotFound from './NotFound';
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';
// import RecoverPage from './auth/RecoverPage';
import Dashboard from './shop/Dashboard';

import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes, { InferProps } from 'prop-types';

const SiteMeta = ():ReactElement => {
    return (<Helmet
            link={[/*{
                    href: canonical,
                    rel: 'canonical',
                }*/]}
            meta={[{
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            }]}
        />
    );
};

const propTypes = {
  signedIn: PropTypes.bool.isRequired
};

const defaultProps = {
  signedIn: false
};

type AppProps = InferProps<typeof propTypes>;

const App = ({signedIn}: AppProps):ReactElement => {

    return (
        <AppLayout>
            <SiteMeta />
            <Switch>
              <Route exact path="/">
                <MainPage />
              </Route>
              {!signedIn &&
                <>
                  <Route path="/register">
                    <RegisterPage />
                  </Route>
                  <Route path="/login">
                    <LoginPage />
                  </Route>
                  {/* <Route path="/recover">
                    <RecoverPage />
                  </Route> */}
                </>
              }
              {signedIn &&
                <>
                  <Route path="/dashboard">
                    <Dashboard />
                  </Route>
                </>
              }
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
        </AppLayout>
    );
};

App.defaultProps = defaultProps;
App.propTypes = propTypes;

export default compose(
  connect((state: Immutable.Map<string, any>) => {
    return {
      signedIn: signedInSelector(state),
    };
  })
)(App as any);