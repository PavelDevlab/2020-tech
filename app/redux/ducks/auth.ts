
import { all, takeLeading, call, put, take, fork, cancel, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { appName } from 'app/config';
import { RegisterPersonActionCreator } from 'app/components/auth/types/RegisterPage';
import { LoginPersonActionCreator } from 'app/components/auth/types/LoginPage';
import api from 'app/services/api';
import history from 'app/redux/history';
import Immutable, {Record} from 'immutable';
import fb from 'firebase';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';
import { PRE_END } from 'app/redux/ducks/support';

/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

export const REGISTER_PERSON_REQUEST = `${prefix}/REGISTER_PERSON_REQUEST`;
export const LOGIN_PERSON_REQUEST = `${prefix}/LOGIN_PERSON_REQUEST`;
export const STORE_TOKEN = `${prefix}/STORE_TOKEN`;
export const STORE_USER = `${prefix}/STORE_USER`;
export const SIGN_IN_SUCCEED = `${prefix}/SIGN_IN_SUCCEED`;
export const SIGN_OUT = `${prefix}/SIGN_OUT`;

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
    error: null,
    signedIn: false
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
        case SIGN_IN_SUCCEED:
            return state.set('signedIn', false)
                        .set('user', payload);
        case SIGN_OUT:
            return state.set('signedIn', false)
                        .set('user', null);
        default:
            return state;
    }
}

/**
 * Selectors
 * */
const moduleSelector = (state:Immutable.Map<string, any>) => state.get(moduleName);
export const signedInSelector = (state:Immutable.Map<string, any>) => moduleSelector(state).get('signedIn');

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

export const signInSucceed = (user: fb.User) => {
    return {
        type: SIGN_IN_SUCCEED,
        payload: user
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    };
};

/**
 * Sagas
 * */
function* registerPersonSaga({ payload: values, meta: actions }:Action):SagaGenerator {
    const { resetForm, setErrors, setSubmitting } = actions;

    try {
        const tokenInfo = yield call(api.signUp, values);
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
        /*const loginInfo = */yield call(api.signIn, values);
        //yield put(storeUser(tokenInfo.user));

        yield call(resetForm);
        yield call([history, "push"], {pathname: "/dashboard"});
    } catch (e) {
        yield call(setErrors, { form: e.message });
        yield call(setSubmitting, false);
    }
}



export const createAuthChannel = () => eventChannel((emit) => api.onAuthChange(user => emit({ user })));

export const watchAuthChangeSaga = function * () {
    let authChannel;
    try {
        authChannel = yield call(createAuthChannel);
        while (true) {
            const { user } = yield take(authChannel);
            if (user) {
                yield put(signInSucceed(user));
            } else {
                yield put(signOut());
            }
        }
    } finally {
        if (yield cancelled()) {
           authChannel.close();
        }
    }
};

export const watchChanelAuthChangeSaga = function * () {
    const watchAuthChangeSagaTask = yield fork(watchAuthChangeSaga);
    while (true) {
        yield take(PRE_END);
        yield cancel(watchAuthChangeSagaTask);
    }
};


export function* saga():SagaGenerator {
    yield all([
        takeLeading(REGISTER_PERSON_REQUEST, registerPersonSaga),
        takeLeading(LOGIN_PERSON_REQUEST, loginPersonSaga),
        fork(watchChanelAuthChangeSaga)
    ]);
}