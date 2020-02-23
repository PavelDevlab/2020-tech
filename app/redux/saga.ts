import { fork, all } from 'redux-saga/effects';
import { saga as authSaga } from 'app/redux/ducks/auth';


function* appSagas() {
    yield all([
        fork(authSaga),
    ]);
}

export default appSagas;
