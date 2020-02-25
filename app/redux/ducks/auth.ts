
import { all, takeLatest, call, put } from 'redux-saga/effects';
import { appName } from 'app/config/index';
import { RegisterPersonActionCreator } from 'app/components/auth/types/RegisterPage';
import api from 'app/services/api';
import history from 'app/redux/history';
import Immutable, {Record} from 'immutable';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';


/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

export const REGISTER_PERSON_REQUEST = `${prefix}/REGISTER_PERSON_REQUEST`;
export const STORE_TOKEN = `${prefix}/STORE_TOKEN`;

/**
 * Reducer
 * */
const TokenRecord = Record({
    idToken: "",
    email: "",
    refreshToken: "",
    expiresIn: "",
    localId: ""
});

const AuthRecord = Record({
    token: new TokenRecord(),
    loading: true,
    error: null
});

export default function reducer(state = new AuthRecord(), action:Action) {
    const {type, payload} = action;

    switch (type) {
        case REGISTER_PERSON_REQUEST:
            return state.set('loading', true)
                        .set('error', true);
        case STORE_TOKEN:
            return state.set('loading', false)
                        .set('token', payload);
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
export const registerPerson:RegisterPersonActionCreator = ({values, actions}) => {
    return {
        type: REGISTER_PERSON_REQUEST,
        payload: values,
        meta: actions
    };
};

export interface RegisterResponse {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
};

export const storeToken = (tokenInfo: Immutable.Map<string, any>) => {
    return {
        type: STORE_TOKEN,
        payload: tokenInfo
    };
};

/**
 * Sagas
 * */
function* registerPersonSaga({ payload: values, meta: actions }:Action):SagaGenerator {
    const { resetForm, setErrors, setSubmitting } = actions;

    try {
        const tokenInfo = yield call(api.signUp, values);
        // eslint-disable-next-line no-console
        console.log(tokenInfo);
        yield put(storeToken(new TokenRecord(tokenInfo)));

        yield call(resetForm);
        yield call([history, "push"], {pathname: "/dashboard"});
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        yield call(setErrors, { authentication: e.message });
        yield call(setSubmitting, false);
    }
}


export function* saga():SagaGenerator {
    yield all([
        takeLatest(REGISTER_PERSON_REQUEST, registerPersonSaga)
    ]);
    // as any
}