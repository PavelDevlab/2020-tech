import {createStore, applyMiddleware, compose, Store} from 'redux';
import { fromJS } from 'immutable';
import thunk from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { preEnd } from 'app/redux/ducks/service';
import { History } from 'history';


import { SagaMiddleware } from '@redux-saga/core/types';

import { routerMiddleware } from 'connected-react-router/immutable';
import createRootReducer, {ReduxAppState} from './reducer';

// type Reducer<S> = <A extends Action>(state: S, action: A) => S;
export type EnhancedStore<S> = Store<S> & {
  runSaga: SagaMiddleware['run'];
  close: () => void;
  injectedReducers: {};
};


// [P1 in keyof EnhancedStorePart]: EnhancedStorePart[P1];
// type MyPartial<S> = Partial<S>;
// type Reducer<S> = <A extends Action>(state: S, action: A) => S;
const createEnhancedStore = (store:Store<ReduxAppState>, sagaMiddleWare:SagaMiddleware) => {
  const enhancedStore = store as EnhancedStore<ReduxAppState>;
  enhancedStore.runSaga = sagaMiddleWare.run;
  enhancedStore.close = () => {
    store.dispatch(preEnd());
    store.dispatch(END);
  },
  enhancedStore.injectedReducers = {};
  return enhancedStore;
};

function createAppStore(initialState:any, history:History<History.PoorMansUnknown>) {
  const sagaMiddleWare = createSagaMiddleware();
  const middlewares = [
    thunk,
    routerMiddleware(history),
    sagaMiddleWare,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const rootReducer = createRootReducer(history);
  const store = createStore( // todo: Solve this any for export store unique interface.
      rootReducer,
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );

/*
  todo: commonjs modules doesn't build for TS
  if ((module as any).hot) { // todo: Solve this when investigate how hot reducer works.
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer(createRootReducer(store.injectedReducers));
    });
  }
 */

  return createEnhancedStore(store, sagaMiddleWare);
}

export default createAppStore;