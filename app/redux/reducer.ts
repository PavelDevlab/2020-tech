
import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { connectRouter } from 'connected-react-router/immutable';
import {History} from 'history';

// import appReducer from 'temp/containers/App/reducers/app';

import {
  immutableReducer as reduxAsyncConnect,
  setToImmutableStateFunc,
  setToMutableStateFunc,
} from 'redux-connect';

setToImmutableStateFunc((mutableState:any) => fromJS(mutableState));
setToMutableStateFunc((immutableState:any) => immutableState.toJS());

export default (history:History) => combineReducers({
  reduxAsyncConnect,
  router: connectRouter(history),
  // appReducer, // todo: Why here dive deeper? Desrtuct it.
});
