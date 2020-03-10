
import { combineReducers } from 'redux-immutable';
import Immutable, { fromJS } from 'immutable';
import { connectRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import appHistory from './history';
import authReducer, {moduleName as authModuleName, AuthRecord } from './ducks/auth';
import mainReducer, {moduleName as mainModuleName, MainRecord } from './ducks/main';

// import appReducer from 'temp/containers/App/reducers/app';

import {
//  immutableReducer as reduxAsyncConnect,
  setToImmutableStateFunc,
  setToMutableStateFunc,
} from 'redux-connect';
import Redux from "redux";
import {RouterState} from "connected-react-router";


setToImmutableStateFunc((mutableState:any) => fromJS(mutableState));
setToMutableStateFunc((immutableState:any) => immutableState.toJS());

const rootReducerCreator = (history:History) => combineReducers({
//  reduxAsyncConnect,
  router: connectRouter(history),
  [authModuleName]: authReducer,
  [mainModuleName]: mainReducer,
});


interface StoreState {
  router: Redux.Reducer<RouterState>,
  [authModuleName]: AuthRecord,
  [mainModuleName]: MainRecord,
}

const storeRecord = Immutable.Record<StoreState>({
  router: connectRouter(appHistory),
  [authModuleName]: new AuthRecord(),
  [mainModuleName]: new MainRecord(),
});

export class StoreRecord extends storeRecord implements StoreState {
  router: Redux.Reducer<RouterState>;
  [authModuleName]: AuthRecord;
  [mainModuleName]: MainRecord;
  constructor(config: Partial<StoreState> = {}) {
    super(config);
  }
}

export default rootReducerCreator;
