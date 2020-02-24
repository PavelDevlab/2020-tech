
import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { connectRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import authReducer, {moduleName as authModuleName} from './ducks/auth';

// import appReducer from 'temp/containers/App/reducers/app';

import {
//  immutableReducer as reduxAsyncConnect,
  setToImmutableStateFunc,
  setToMutableStateFunc,
} from 'redux-connect';

type ReducerState<R> = R extends <S, A>(state: infer T, action: A) => S ? T : never;
type ReducerCreatorResult<C> = C extends (history: History) => infer T ? T : never;
type ReduxState<C> = ReducerState<ReducerCreatorResult<C>>;

setToImmutableStateFunc((mutableState:any) => fromJS(mutableState));
setToMutableStateFunc((immutableState:any) => immutableState.toJS());

const rootReducerCreator = (history:History) => combineReducers({
//  reduxAsyncConnect,
  router: connectRouter(history),
  [authModuleName]: authReducer
});

export type ReduxAppState = ReduxState<typeof rootReducerCreator>;

export default rootReducerCreator;
