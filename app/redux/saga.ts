import { fork, all, put } from 'redux-saga/effects';
import { saga as authSaga } from 'app/redux/ducks/auth';


function* appSagas() {
    yield all([
        fork(authSaga),
    ]);
}


export function* loadInitialData() {
    yield put({type: 'USELESS_ACTION'});
    return 'done';
}

export default appSagas;
