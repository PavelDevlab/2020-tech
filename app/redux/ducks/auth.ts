
import { all, fork, takeLatest } from 'redux-saga/effects';
import { appName } from 'app/config/index';

/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

export const REGISTER_PERSON_REQUEST = `{prefix}/REGISTER_PERSON_REQUEST`;

/**
 * Reducer
 * */
export default function reducer(state = {}, action) {
    const {type, payload} = action

    switch (type) {
        case REGISTER_PERSON_REQUEST:
            return state;
        default:
            return state;
    }
}

/**
 * Selectors
 * */
// export const peopleListSelector = (state) => state[moduleName].entities.valueSeq().toArray()

/**
 * Action Creators
 * */
export const registerPerson = ({values, actions}) => {
    return {
        type: REGISTER_PERSON_REQUEST,
        payload: {values, actions}
    };
};

/**
 * Sagas
 * */

export function registerPersonSaga * () {

}

export function saga * () {
    all([
        takeLatest(REGISTER_PERSON_REQUEST , registerPersonSaga())
    ]);
};
