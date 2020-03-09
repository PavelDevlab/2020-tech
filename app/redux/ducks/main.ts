
import { all, takeLeading, call, put, select } from 'redux-saga/effects';

import Immutable from 'immutable';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';


/**
 * Constants
 * */
export const moduleName = 'main';
// const prefix = `${appName}/${moduleName}`;

enum MainActionType {
    LoadMainRequest = 'main/LoadMainRequest',
    LoadMainSucceed = 'main/LoadMainSucceed'
}

/**
 * Reducer
 * */
interface MainRecordState {
    info: string
}
const mainRecord = Immutable.Record<MainRecordState>({
    info: ""
});
export class MainRecord extends mainRecord implements MainRecordState {
    info: string;
    constructor(config: Partial<MainRecordState> = {}) {
        super(config);
    }
}


// type MainAction = ;
/**
 * Reducer
 * */
export default function reducer(state:MainRecord = new MainRecord(), action:Action):MainRecord {

    switch (action.type) {
        case MainActionType.LoadMainSucceed:
            return state.set('info', action.payload);
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

interface CreateLoadMainAction {
    type: MainActionType.LoadMainRequest
}
export type CreateLoadMainRequestCreator = () => CreateLoadMainAction;
export const createLoadMainRequest:CreateLoadMainRequestCreator = () => {
    return {
        type: MainActionType.LoadMainRequest,
    };
};

interface CreateLoadMainSucceedAction {
    type: MainActionType.LoadMainSucceed,
    payload: string
}
export type CreateLoadMainSucceedCreator = (info:string) => CreateLoadMainSucceedAction;
const createLoadMainSucceed:CreateLoadMainSucceedCreator = (info:string) => {
    return {
        type: MainActionType.LoadMainSucceed,
        payload: info
    };
};

function sleep():Promise<void> {
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
        takeLeading(MainActionType.LoadMainRequest, loadMainInfo)
    ]);
}
