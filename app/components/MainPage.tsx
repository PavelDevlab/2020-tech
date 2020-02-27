import React from "react";
import { compose } from 'redux';
import { createLoadMainRequest } from 'app/redux/ducks/main';
import Immutable from 'immutable';
import { useIsomorphicEffect } from 'app/extentions/react';
import { mainInfoSelector } from 'app/redux/ducks/main';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from './AppLayout/style.scss';
import { connect } from  'react-redux';
import PropTypes, { InferProps } from "prop-types";

// import {Func1} from 'redux';

const propTypes = {
    info: PropTypes.string.isRequired,
    loadMainInfo: PropTypes.func.isRequired
};

const defaultProps = {
    info: '',
    onSubmit: () => null
};

type MainPageProps = InferProps<typeof propTypes>;

const MainPage = ({info, loadMainInfo}:MainPageProps) => {

    useIsomorphicEffect(() => {
        loadMainInfo();
    }, []);

    return (
        <div>
            {info}
        </div>
    );
};


MainPage.propTypes = propTypes;
MainPage.defaultProps = defaultProps;

export default compose(
    connect((state:Immutable.Map<string, any>) => {
        return {
          info: mainInfoSelector(state),
        };
      }, (dispatch) => ({
        loadMainInfo() {
          dispatch(createLoadMainRequest());
        }
      })
    ),
    withStyles(s),
)(MainPage as any);