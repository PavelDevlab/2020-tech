import { fork, all } from 'redux-saga/effects';
import { saga as authSaga } from 'app/redux/ducks/auth';
import { saga as mainSaga } from 'app/redux/ducks/main';


function* appSagas() {
    yield all([
        fork(authSaga),
        fork(mainSaga)
    ]);
}

export default appSagas;
