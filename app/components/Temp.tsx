import React from "react";
import { asyncConnect } from 'redux-connect';

const Temp = () => {
    return (
        <div>Temp</div>
    );
};

export default asyncConnect([
    {
        key: 'usersFromServer',
        promise: async () => {
            return Promise.resolve();
        },
    },
])(Temp);