import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router/immutable';
import App from 'app/components/App';

import StyleContext from 'isomorphic-style-loader/StyleContext';
import 'app/services/api';
import history from 'app/redux/history';

import saga from 'app/redux/saga';
import index from 'app/redux';


// eslint-disable-next-line no-underscore-dangle
const initialState = !process.env.IS_SERVER ? (window as any).__INITIAL_DATA__ : {};

const store = index(initialState, history);
store.runSaga(saga);
// todo: If the store has private info?
// todo: Why we attach it to window?
// Dont do this on production.
if (!process.env.IS_SERVER) {
    (window as any).store = store;
}

const insertCss = (...styles:any[]) => {
  // eslint-disable-next-line no-underscore-dangle
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

export const browserRender = () => {

  hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <Provider key="provider" store={store} >
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </StyleContext.Provider>,
    document.getElementById('app'),
  );
};
