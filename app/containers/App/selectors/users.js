import { createSelector } from 'reselect';

export const getAppReducer = state => state.get('appReducer');

export const getUsersSaga = createSelector(
  getAppReducer,
    appReducer => appReducer.get('usersFromSaga'),
);

export const getUsersAsyncConnect = createSelector(
  getAppReducer,
    appReducer => appReducer.get('usersFromAsyncConnect'),
);
