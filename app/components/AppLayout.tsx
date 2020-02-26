
import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { compose } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { signedInSelector, singOutRequest } from 'app/redux/ducks/auth';

const propTypes = {
    signedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

const defaultProps = {
    onLogout: () => null,
    signedIn: false,
    children: null
};

const AppLayout = ({signedIn, children, onLogout}:InferProps<typeof propTypes>) => {

    return (
        <div>
            <div>
                <h3>Menu:</h3>
                <Link to="/">
                    main
                </Link>{' '}
                {!signedIn &&
                    <>
                        <Link to="/login">
                            login
                        </Link>{' '}
                        <Link to="/register">
                            register
                        </Link>{' '}{/*
                        <Link to="/recover">
                            recover
                        </Link>
                        */}
                    </>
                }
                {signedIn &&
                    <>
                        {' '}<Link to="/dashboard">
                            dashboard
                        </Link>{' '}
                        <a href="javascript:void(0);" onClick={onLogout}>
                          Sign out
                        </a>
                    </>
                }
            </div>
            {children}
        </div>
    );
};

AppLayout.defaultProps = defaultProps;
AppLayout.propTypes = propTypes;

export default compose(
  connect((state: Immutable.Map<string, any>) => {
        return {
            signedIn: signedInSelector(state),
        };
    }, (dispatch) => ({
      onLogout() {
        dispatch(singOutRequest());
      }
    })
  )
)(AppLayout as any);