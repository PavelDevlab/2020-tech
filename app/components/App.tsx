import React, { ReactElement } from 'react';
import AppLayout from 'components/AppLayout';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';

import MainPage from './MainPage';
import NotFound from './NotFound';
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';
import RecoverPage from './auth/RecoverPage';
import Dashboard from './shop/Dashboard';

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

const App = ():ReactElement => {

    return (
        <AppLayout>
            <SiteMeta />
            <Switch>
                <Route exact path="/">
                    <MainPage />
                </Route>
                <Route path="/register">
                    <RegisterPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/recover">
                    <RecoverPage />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </AppLayout>
    );
};

export default App;