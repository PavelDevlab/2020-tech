import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router/immutable';
import routes from 'routes';
import {
  ReduxAsyncConnect,
} from 'redux-connect';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import index from './redux';


// eslint-disable-next-line no-underscore-dangle
const initialState = !process.env.IS_SERVER ? window.__INITIAL_DATA__ : {};

const history = process.env.IS_SERVER
  ? createMemoryHistory({
    initialEntries: ['/'],
  })
  : createBrowserHistory();

const store = index(initialState, history);
// todo: If the store has private info?
// todo: Why we attach it to window?
// Dont do this on production.
if (!process.env.IS_SERVER) {
  window.store = store;
}

const insertCss = (...styles) => {
  // eslint-disable-next-line no-underscore-dangle
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

export const browserRender = () => {

  hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <Provider key="provider" store={store} >
        <ConnectedRouter history={history}>
          <ReduxAsyncConnect helpers={{}} routes={routes} />
        </ConnectedRouter>
      </Provider>
    </StyleContext.Provider>,
    document.getElementById('app'),
  );
};
