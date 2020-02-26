
import { all, takeLeading, call, put } from 'redux-saga/effects';
import { appName } from 'app/config';
import { RegisterPersonActionCreator } from 'app/components/auth/types/RegisterPage';
import { LoginPersonActionCreator } from 'app/components/auth/types/LoginPage';
import api from 'app/services/api';
import history from 'app/redux/history';
import Immutable, {Record} from 'immutable';
import fb from 'firebase';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';


/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

export const REGISTER_PERSON_REQUEST = `${prefix}/REGISTER_PERSON_REQUEST`;
export const LOGIN_PERSON_REQUEST = `${prefix}/LOGIN_PERSON_REQUEST`;
export const STORE_TOKEN = `${prefix}/STORE_TOKEN`;
export const STORE_USER = `${prefix}/STORE_USER`;

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
    user: null,
    loading: true,
    error: null
});

export default function reducer(state = new AuthRecord(), action:Action) {
    const {type, payload} = action;

    switch (type) {
        case REGISTER_PERSON_REQUEST:
        case LOGIN_PERSON_REQUEST:
            return state.set('loading', true)
                        .set('error', true);
        case STORE_TOKEN:
            return state.set('loading', false)
                        .set('token', payload);
        case STORE_USER:
            return state.set('loading', false)
                        .set('user', payload);
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

export const loginPerson:LoginPersonActionCreator = ({values, actions}) => {
    return {
        type: LOGIN_PERSON_REQUEST,
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

export const storeUser = (user: fb.User) => {
    return {
        type: STORE_USER,
        payload: user
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
        yield call([history, "push"], {pathname: "/login"});
    } catch (e) {
        yield call(setErrors, { form: e.message });
        yield call(setSubmitting, false);
    }
}

function* loginPersonSaga({ payload: values, meta: actions }:Action):SagaGenerator {
    const { resetForm, setErrors, setSubmitting } = actions;

    try {
        const tokenInfo = yield call(api.signIn, values);
        // eslint-disable-next-line no-console
        console.log(tokenInfo);
        yield put(storeUser(tokenInfo.user));

        yield call(resetForm);
        yield call([history, "push"], {pathname: "/dashboard"});
    } catch (e) {
        yield call(setErrors, { form: e.message });
        yield call(setSubmitting, false);
    }
}


export function* saga():SagaGenerator {
    yield all([
        takeLeading(REGISTER_PERSON_REQUEST, registerPersonSaga),
        takeLeading(LOGIN_PERSON_REQUEST, loginPersonSaga),
    ]);
}