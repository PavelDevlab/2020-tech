import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { renderRoutes } from 'react-router-config';
import { RouteConfig } from 'react-router-config';

import {connect} from 'app/extentions/react-redux'; // todo: Make it work.

// import { getRouterLocation } from './selectors/router';

export interface AppComponentProps {
    // location: any,
    route: RouteConfig
}

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
        const { route } = this.props;

        return (
            <div>
                {this.renderSiteMeta()}
                {this.props.children}
                {renderRoutes(route.routes)}
            </div>
        );
    }
}

export default App;