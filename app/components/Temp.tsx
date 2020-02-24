import React, { Component, ComponentType } from "react";
// import { asyncConnect } from 'redux-connect';
import { compose } from 'redux';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from './style.scss';

// import NotFound from './NotFound';

import {Func1} from 'redux';

/*
const Temp = () => {
    return (
        <div>
            <NotFound />
            <div className="my-style">Temp</div>
        </div>
    );
};
 */

class Temp extends Component {
    render() {
        return (
            <div>
                {/* <NotFound /> */}
                <div className={s["my-style"]}>Temp</div>
            </div>
        );
    }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default compose(
    (withStyles(s) as Func1<ComponentType, ComponentType>),
/*
    (asyncConnect([
        {
            key: 'usersFromServer',
            promise: async () => {
                return Promise.resolve();
            },
        },
    ]) as Func1<ComponentType, ComponentType>),
 */
)(Temp);