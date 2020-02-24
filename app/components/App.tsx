import React, { Component } from 'react';
import AppLayout from 'components/AppLayout';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';

import {connect} from 'app/extentions/react-redux'; // todo: Make it works.

// import { getRouterLocation } from './selectors/router';
/*
export interface AppComponentProps {
    // location: any,
    route: RouteConfig
}
*-/
 */

import Temp from './Temp';
import NotFound from './NotFound';
import RegisterPage from './auth/RegisterPage';
import LoginPage from './auth/LoginPage';
import RecoverPage from './auth/RecoverPage';
import Dashboard from './shop/Dashboard';
// import { RouteConfig } from 'react-router-config';

/*
import Loadable from 'react-loadable';
import Loading from 'components/Loading';

const UsersLoadable = Loadable({
  loader: () => import('./../../pages/Users'),
  loading: Loading,
});
*/

@(connect(() => ({
    // location: getRouterLocation(state), todo: Make it.
}), null) as any)
class App extends Component<AppComponentProps, {}> {
/*
    static propTypes = {
        location: PropTypes.shape({}).isRequired,
        route: PropTypes.shape({}).isRequired,
    };
*/

    renderSiteMeta() {
        // const canonical = this.props.location.toJS().pathname.toLowerCase();
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
    }

    render() {

        return (
            <AppLayout>
                {this.renderSiteMeta()}
                <Switch>
                    <Route exact path="/">
                        <Temp />
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
    }
}

export default App;