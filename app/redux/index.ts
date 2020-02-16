import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import thunk from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { routerMiddleware } from 'connected-react-router/immutable';
import createRootReducer from './reducer';
import {History} from "history";

export default function index(initialState = {}, history:History) {
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

  let store:any = createStore( // todo: Solve this any for export store unique interface.
    createRootReducer(history),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );

  store.runSaga = sagaMiddleWare.run;
  store.close = () => store.dispatch(END);
  // Extensions
  store.injectedReducers = {}; // Reducer registry

  if ((module as any).hot) { // todo: Solve this when investigate how hot reducer works.
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer(createRootReducer(store.injectedReducers));
    });
  }

  return store;
}
