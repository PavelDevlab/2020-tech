
import { all, takeLeading, call, put, take, fork, cancel, cancelled } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
// import { appName } from 'app/config';
import { RegisterValues } from 'app/components/auth/types/RegisterPage';
import { LoginValues } from 'app/components/auth/types/LoginPage';
import api from 'app/services/api';
import history from 'app/redux/history';
import Immutable from 'immutable';
import fb from 'firebase';

import { SagaGenerator } from 'app/redux/types/saga';
import { Action } from 'app/redux/types';
import { ServiceActionType } from 'app/redux/ducks/service';
import {FormikHelpers, FormikValues} from "formik/dist/types";

/**
 * Constants
 * */
export const moduleName = 'auth';
// const prefix = `${appName}/${moduleName}`;

enum AuthActionType {
    RegisterPersonRequest = 'auth/RegisterPersonRequest',
    LoginPersonRequest = 'auth/LoginPersonRequest',
    StoreToken = 'auth/StoreToken',
    SignInSucceed = 'auth/SignInSucceed',
    SignOut = 'auth/SignOut',
    SignOutRequest = 'auth/SignOutRequest'
};


/**
 * Reducer
 * */
interface TokenState {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

const tokenRecord = Immutable.Record<TokenState>({
    idToken: "",
    email: "",
    refreshToken: "",
    expiresIn: "",
    localId: ""
});

export class TokenRecord extends tokenRecord implements TokenState {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    constructor(config: Partial<TokenState> = {}) {
        super(config);
    }
}

interface AuthState {
    token: TokenRecord,
    user: fb.User | null,
    loading: boolean,
    error: string|null,
    signedIn: boolean
}

const authRecord = Immutable.Record<AuthState>({
    token: new TokenRecord(),
    user: null,
    loading: true,
    error: null,
    signedIn: false
});

export class AuthRecord extends authRecord implements AuthState {
    token: TokenRecord;
    user: fb.User | null;
    loading: boolean;
    error: string|null;
    signedIn: boolean;
    constructor(config: Partial<AuthState> = {}) {
        super(config);
    }
}

type AuthAction = RegisterPersonAction | LoginPersonAction | StoreTokenAction | SignInSucceedAction | SignOutAction;

export default function reducer(state: AuthRecord = new AuthRecord(), action:AuthAction):AuthRecord {
    switch (action.type) {
        case AuthActionType.RegisterPersonRequest:
        case AuthActionType.LoginPersonRequest:
            return state.set('loading', true)
                        .set('error', null);
        case AuthActionType.StoreToken:
            return state.set('loading', false)
                        .set('token', action.payload);
        case AuthActionType.SignInSucceed:
            return state.set('signedIn', true)
                        .set('user', action.payload);
        case AuthActionType.SignOut:
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
interface RegisterPersonAction {
    type: AuthActionType.RegisterPersonRequest,
    payload: FormikValues,
    meta: FormikHelpers<RegisterValues>
}
export type RegisterPersonActionCreator = (payload:{values:FormikValues, actions:FormikHelpers<RegisterValues>}) => RegisterPersonAction;
export const registerPerson:RegisterPersonActionCreator = ({values, actions}) => {
    return {
        type: AuthActionType.RegisterPersonRequest,
        payload: values,
        meta: actions
    };
};

interface LoginPersonAction {
    type: AuthActionType.LoginPersonRequest,
    payload: FormikValues,
    meta: FormikHelpers<LoginValues>
}
export type LoginPersonActionCreator = (payload:{values:FormikValues, actions:FormikHelpers<LoginValues>}) => LoginPersonAction;
export const loginPerson:LoginPersonActionCreator = ({values, actions}) => {
    return {
        type: AuthActionType.LoginPersonRequest,
        payload: values,
        meta: actions
    };
};

interface StoreTokenAction {
    type: AuthActionType.StoreToken,
    payload: TokenRecord
}
export type StoreTokenActionCreator = (tokenInfo: TokenRecord) => StoreTokenAction;
export const storeToken:StoreTokenActionCreator = (tokenInfo) => {
    return {
        type: AuthActionType.StoreToken,
        payload: tokenInfo
    };
};

interface SignInSucceedAction {
    type: AuthActionType.SignInSucceed,
    payload: fb.User
}
export type SignInSucceedActionCreator = (tokenInfo: fb.User) => SignInSucceedAction;
export const signInSucceed:SignInSucceedActionCreator = (user: fb.User) => {
    return {
        type: AuthActionType.SignInSucceed,
        payload: user
    };
};

interface SignOutAction {
    type: AuthActionType.SignOut
}
export type SignOutActionCreator = () => SignOutAction;
export const signOut:SignOutActionCreator = () => {
    return {
        type: AuthActionType.SignOut
    };
};

interface SingOutRequestAction {
    type: AuthActionType.SignOutRequest
}
export type SingOutRequestCreator = () => SingOutRequestAction;
export const singOutRequest:SingOutRequestCreator = () => {
    return {
        type: AuthActionType.SignOutRequest
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
        const loginInfo = yield call(api.signIn, values);
        yield put(signInSucceed(loginInfo.user));

        yield call(resetForm);
        yield call([history, "push"], {pathname: "/dashboard"});
    } catch (e) {
        yield call(setErrors, { form: e.message });
        yield call(setSubmitting, false);
    }
}

function* signOutSaga():SagaGenerator {
    // while(false) {
        /*const result = */ yield call(api.signOut);
        // console.log(result);
    // }

    /*
        console.log(result);
        yield put(signOut());
     */
}


interface UserEvent {
    user:fb.User|null
}
export const createAuthChannel = ():EventChannel<UserEvent> => eventChannel<UserEvent>((emit) => api.onAuthChange(user => emit({ user })));

export const watchAuthChangeSaga = function * ():SagaGenerator {
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

export const watchChanelAuthChangeSaga = function * ():SagaGenerator {
    const watchAuthChangeSagaTask = yield fork(watchAuthChangeSaga);
    while (true) {
        yield take(ServiceActionType.PreEnd);
        yield cancel(watchAuthChangeSagaTask);
    }
};

export function* saga():SagaGenerator {
    yield all([
        takeLeading(AuthActionType.RegisterPersonRequest, registerPersonSaga),
        takeLeading(AuthActionType.LoginPersonRequest, loginPersonSaga),
        takeLeading(AuthActionType.SignOutRequest, signOutSaga),
        fork(watchChanelAuthChangeSaga)
    ]);
}