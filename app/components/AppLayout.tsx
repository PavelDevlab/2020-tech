
import React, { Component, ReactElement } from 'react';
import {Link} from 'react-router-dom';

type AppLayoutType = {
    children: ReactElement[]
};

class AppLayout extends Component<AppLayoutType> {


    render() {

        return (
            <div>
                <div>
                    <h3>Menu:</h3>
                    <Link to="/login">
                        login
                    </Link>{' '}
                    <Link to="/register">
                        register
                    </Link>{' '}
                    <Link to="/recover">
                        recover
                    </Link>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default AppLayout;