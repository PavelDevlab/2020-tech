
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";

const propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

const AppLayout = (props:InferProps<typeof propTypes>) => {

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
            {props.children}
        </div>
    );
};

AppLayout.propTypes = propTypes;

export default AppLayout;