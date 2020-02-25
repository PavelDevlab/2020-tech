
import { all, takeLeading, call, put, select } from 'redux-saga/effects';
import { appName } from 'app/config';
import Immutable, {Record} from 'immutable';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';



/**
 * Constants
 * */
export const moduleName = 'main';
const prefix = `${appName}/${moduleName}`;

export const LOAD_MAIN_REQUEST = `${prefix}/LOAD_MAIN_REQUEST`;
export const LOAD_MAIN_SUCCEED = `${prefix}/LOAD_MAIN_SUCCEED`;

/**
 * Reducer
 * */
const AuthRecord = Record({
    info: ""
});

/**
 * Reducer
 * */
export default function reducer(state = new AuthRecord(), action:Action) {
    const {type, payload} = action

    switch (type) {
        case LOAD_MAIN_SUCCEED:
            return state.set('info', payload);
        default:
            return state;
    }
}

/**
 * Selectors
 * */
export const mainInfoSelector = (state:Immutable.Map<string, any>) => state.get(moduleName).get('info');

/**
 * Action Creators
 * */
export const createLoadMainRequest = () => {
    return {
        type: LOAD_MAIN_REQUEST,
    };
};

const createLoadMainSucceed = (info:string) => {
    return {
        type: LOAD_MAIN_SUCCEED,
        payload: info
    };
};

function sleep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    });
}

/**
 * Sagas
 * */
function* loadMainInfo():SagaGenerator {
    const currentInfo = yield select(mainInfoSelector);
    if (!currentInfo) {
        yield call(sleep);
        yield put(createLoadMainSucceed("Main unique info. -_-"));
    }
}


export function* saga():SagaGenerator {
    yield all([
        takeLeading(LOAD_MAIN_REQUEST, loadMainInfo)
    ]);
}
