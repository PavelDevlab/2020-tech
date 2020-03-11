
import React from "react";
import { compose } from 'app/services/utils';
import { CreateLoadMainRequest } from 'app/redux/ducks/main';
import { StoreRecord } from 'app/redux/reducer';
import { useIsomorphicEffect } from 'app/extentions/react';
import { mainInfoSelector } from 'app/redux/ducks/main';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from './AppLayout/style.scss';
import { connect, ConnectedProps } from  'react-redux';

const connector = connect((state: StoreRecord) => {
        return {
            info: mainInfoSelector(state),
        };
    }, (dispatch) => ({
        loadMainInfo() {
            dispatch(new CreateLoadMainRequest());
        }
    })
);

type MainPageProps = ConnectedProps<typeof connector>;

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
    connector,
    withStyles(s),
)(MainPage);