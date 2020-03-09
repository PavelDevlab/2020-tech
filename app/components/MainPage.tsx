import React from "react";
import { compose } from 'redux';
import { createLoadMainRequest } from 'app/redux/ducks/main';
import Immutable from 'immutable';
import { useIsomorphicEffect } from 'app/extentions/react';
import { mainInfoSelector } from 'app/redux/ducks/main';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from './AppLayout/style.scss';
import { connect } from  'react-redux';

type MainPageProps = {
    info: string,
    loadMainInfo: () => void
};

const MainPage:React.FunctionComponent<MainPageProps> = ({info, loadMainInfo}) => {

    useIsomorphicEffect(() => {
        loadMainInfo();
    }, []);

    return (
        <div>
            {info}
        </div>
    );
};

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
)(MainPage);