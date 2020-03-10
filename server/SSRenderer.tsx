
import path from 'path';
import fs from 'fs';
import { Provider } from 'react-redux';


import Helmet from 'react-helmet';
import React from 'react';
import { createMemoryHistory } from 'history';
import ReactDOMServer from 'react-dom/server';

import { UrlWithStringQuery } from 'url';
import { StoreRecord } from 'app/redux/reducer';

import { StaticRouter } from 'react-router-dom';
import App from 'app/components/App';

import createAppStore from 'app/redux';
import { parse as parseUrl } from 'url';
// import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import StyleContext from 'isomorphic-style-loader/StyleContext';

// import routes from 'app/components/routes';
import sagas from 'app/redux/saga';
import  { Task } from 'redux-saga';
import { EnhancedStore } from 'app/redux';

export interface RenderResult {
    status: number;
    html?: string;
    url?: string;
};

export type SSRendererProps = {
    url: string
};

class SSRenderer {

    private status:number;
    private html:string;
    private context: {[key: string]: any};
    private rootTask: Task;
    private css:Set<string>;
    private location: UrlWithStringQuery;
    private store: EnhancedStore<StoreRecord>;


    constructor({ url }:SSRendererProps) {
        const history = createMemoryHistory({
            initialEntries: [url],
        });
        const initialState = {};

        this.context = {};
        this.status = 200;
        this.html = '';
        this.css = new Set();
        this.store = createAppStore(initialState, history);;
        this.location = parseUrl(url);
    }

    private triggerSagaRender():string {
        this.rootTask = this.store.runSaga(sagas);
        const appContent = this.renderAppContent();
        this.store.close();
        return appContent;
    }

    private tryToFinishWithRedirect():(RenderResult|null) {
        if (this.context.url) {
            return {
                status: 302,
                url: this.context.url
            };
        }
        return null;
    }

    public render() {
        return Promise.resolve()
          .then(() => this.triggerSagaRender())
          .then(() => this.tryToFinishWithRedirect())
          .then((result) => {
                if (result) return result;
                if (!result) return new Promise<RenderResult>((resolve) => {
                    this.rootTask.toPromise()
                      .then(() => {
                          this.finishResult()
                            .then(resolve);
                      })
                      .catch(() => {
                          this.finishResult()
                            .then(resolve);
                      });
                });
          });
    }

    private finishResult():Promise<RenderResult> {
        return new Promise((resolve) => resolve())
          .then(() => this.finishRender())
          .then(() => this.tryToFinishWithRedirect())
          .then((result:RenderResult|null) => {
              if (result) return result;
              return this.getResult();
          });
    }

    private getResult():RenderResult {
        return {
            status: this.status,
            html: this.html,
        };
    }

    private renderAppContent():string {
        this.context = {};
        this.css = new Set(); // CSS for all rendered React components
        // eslint-disable-next-line no-underscore-dangle
        const insertCss = (...styles: any[]) =>
            styles.forEach(style => this.css.add(style._getCss()));
        // todo: Create a type with a method only for this case.
        const appContent = ReactDOMServer.renderToString(
            <StyleContext.Provider value={{ insertCss }}>
                <Provider key="provider" store={this.store}>
                    <StaticRouter context={this.context} location={this.location}>
                        <App />
                    </StaticRouter>
                </Provider>
            </StyleContext.Provider>
        );
        return appContent;
    }

    private finishRender = () => {
        return new Promise((resolve) => {
            const indexFile = path.resolve('./build/public/main.html');
            const appContent = this.renderAppContent();

            const helmet = Helmet.renderStatic(); // todo: does not work fix it.
            fs.readFile(indexFile, 'utf8', (err, data) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log('Something went wrong:', err);
                    this.status = 500;
                    this.html = 'Oops, better luck next time!';
                    return resolve();
                }
                // todo: Strange way to template a file. Use real templates or template-like placeholders.
                data = data.replace('__STYLES__', [...this.css].join(''));
                data = data.replace('__LOADER__', '');
                data = data.replace(
                    '<div id=app></div>',
                    `<div id=app>${appContent}</div>`
                );
                data = data.replace(
                    '<div id="app"></div>',
                    `<div id="app">${appContent}</div>`
                );
                data = data.replace('<title></title>', helmet.title.toString());
                // todo: does not work fix it.
                data = data.replace(
                    '<meta name="description" content=""/>',
                    helmet.meta.toString()
                ); // todo: does not work fix it.
                data = data.replace(
                    '<script>__INITIAL_DATA__</script>',
                    `<script>window.__INITIAL_DATA__ = ${JSON.stringify(
                        this.store.getState()
                    )};</script>`
                );
                this.status = 200;
                this.html = data;
                return resolve();
            });
        });
    }

}

export default SSRenderer;