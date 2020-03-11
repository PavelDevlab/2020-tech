import React from 'react';

import AppLayout from 'app/components/AppLayout/index';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';

import MainPage from './MainPage';
import NotFound from './NotFound';
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';

import Dashboard from './shop/Dashboard';
import { PrivateRoute, PublicRoute } from 'components/AuthRoute';


const SiteMeta:React.FunctionComponent<{}> = () => {
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

const App:React.FunctionComponent<{}> = () => {

    return (
        <AppLayout>
            <SiteMeta />
            <Switch>
              <Route exact path="/">
                <MainPage />
              </Route>
              <PublicRoute path="/register">
                <RegisterPage />
              </PublicRoute>
              <PublicRoute path="/login">
                <LoginPage />
              </PublicRoute>
              <PrivateRoute path="/dashboard">
                <Dashboard />
              </PrivateRoute>
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
        </AppLayout>
    );
};

export default App;