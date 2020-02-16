import { put, call, fork, all } from 'redux-saga/effects';

export function* loadInitialData() {
    try {
        yield put({type: "TEMP_ACTION"});
    } catch (e) {
        console.error(e);
    }
}

function* watch() {
    yield fork(loadInitialData);
}


function* appSagas() {
    yield all([
        fork(watch),
    ]);
}

export default appSagas;
