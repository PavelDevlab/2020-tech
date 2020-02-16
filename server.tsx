import 'babel-polyfill';

import path from 'path';
import fs from 'fs';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';

import Helmet from 'react-helmet';
import React from 'react';
import express from 'express';
import { createMemoryHistory } from 'history';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import index from './app/redux';
import { parse as parseUrl } from 'url'
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import routes from './app/routes';
import sagas from './app/redux/saga';

const PORT = process.env.PORT || 3001;
const app = express();

/*
let a;
const logAString = (str) => {
    console.log(str);
};
logAString(a);
 */

app.use(express.static('./build'));

const initialState = {};

app.get('*', (req, res) => {
  const url = req.originalUrl || req.url;
  const history = createMemoryHistory({
    initialEntries: [url],
  });
  const store = index(initialState, history);
  const location = parseUrl(url);
  const helpers = {};
  const indexFile = path.resolve('./build/main.html');

  /*
        todo: Run sagas here is not true way.
              Run sagas under configureStore and
              return a new promise for finish store init.
  */
  store.runSaga(sagas).toPromise().then(() => {
    return loadOnServer({ store, location, routes, helpers })
      .then(() => {

        /*
            todo: resolve this moment with context
                  its never pass to redirect here.
                  React router doc for help.
        */
          const context = {};
        /*
            todo: resolve this moment with context
            if (context.url) {
              req.header('Location', context.url);
              return res.send(302)
            }
         */

        const css = new Set(); // CSS for all rendered React components
        const insertCss = (...styles:any[]) => styles.forEach(style => css.add(style._getCss())); // todo: Create a type with a method only for this case.

        const appContent = ReactDOMServer.renderToString(
          <StyleContext.Provider value={{ insertCss }}>
            <Provider store={store} key="provider">
              <StaticRouter location={location} context={context}>
                <ReduxAsyncConnect routes={routes} helpers={helpers}/>
              </StaticRouter>
            </Provider>
          </StyleContext.Provider>
        );

        const helmet = Helmet.renderStatic(); // todo: does not work fix it.

        fs.readFile(indexFile, 'utf8', (err, data) => {
          if (err) {
            console.log('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
          }
          // todo: Strange way to template a file. Use real templates or template-like placeholders.
          data = data.replace('__STYLES__', [...css].join(''));
          data = data.replace('__LOADER__', '');
          data = data.replace('<div id=app></div>', `<div id=app>${appContent}</div>`);
          data = data.replace('<div id="app"></div>', `<div id="app">${appContent}</div>`);
          data = data.replace('<title></title>', helmet.title.toString()); // todo: does not work fix it.
          data = data.replace('<meta name="description" content=""/>', helmet.meta.toString()); // todo: does not work fix it.
          data = data.replace('<script>__INITIAL_DATA__</script>', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(store.getState())};</script>`);

          return res.send(data);
        });
      });
      store.close();
  });
});

Loadable.preloadAll().then(() => {
  app.listen(PORT, () => {
    console.log(`😎 Server is listening on port ${PORT}`);
  });
});

