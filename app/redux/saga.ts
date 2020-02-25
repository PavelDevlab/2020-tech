import { fork, all, put } from 'redux-saga/effects';
import { saga as authSaga } from 'app/redux/ducks/auth';
import { saga as mainSaga } from 'app/redux/ducks/main';


function* appSagas() {
    yield all([
        fork(authSaga),
        fork(mainSaga)
    ]);
}


export function* loadInitialData() {
    yield put({type: 'USELESS_ACTION'});
    return 'done';
}

export default appSagas;
