
import path from 'path';
import fs from 'fs';
import { Provider } from 'react-redux';


import Helmet from 'react-helmet';
import React from 'react';
import { createMemoryHistory } from 'history';
import ReactDOMServer from 'react-dom/server';

import { UrlWithStringQuery } from 'url';
import { ReduxAppState } from 'app/redux/reducer';

import { StaticRouter } from 'react-router-dom';
import App from 'app/components/App';

import createAppStore from 'app/redux';
import { parse as parseUrl } from 'url';
// import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import StyleContext from 'isomorphic-style-loader/StyleContext';

// import routes from 'app/components/routes';
import sagas from 'app/redux/saga';
import { EnhancedStore } from 'app/redux';

export interface RenderResult {
    status: number;
    html: string;
};

export type SSRendererProps = {
    url: string
};

class SSRenderer {

    private status:number;
    private html:string;

    private css:Set<string>;
    private location: UrlWithStringQuery;
    private store: EnhancedStore<ReduxAppState>;


    constructor({ url }:SSRendererProps) {
        const history = createMemoryHistory({
            initialEntries: [url],
        });
        const initialState = {};

        this.status = 200;
        this.html = '';
        this.css = new Set();
        this.store = createAppStore(initialState, history);;
        this.location = parseUrl(url);
    }

    public render() {
        const rootTask = this.store.runSaga(sagas);

        this.renderAppContent();
        this.store.close();

        return new Promise<RenderResult>((resolve) => {
            const finish = () => {
                this.finishRender().then(() => {
                    resolve(this.getResult());
                });
            };
            rootTask.toPromise()
                .then(finish)
                .catch(finish);
        });
    }

    private getResult() {
        return {
            status: this.status,
            html: this.html,
        };
    }

    private renderAppContent() {
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
        this.css = new Set(); // CSS for all rendered React components
        // eslint-disable-next-line no-underscore-dangle
        const insertCss = (...styles: any[]) =>
            styles.forEach(style => this.css.add(style._getCss()));
        // todo: Create a type with a method only for this case.
        const appContent = ReactDOMServer.renderToString(
            <StyleContext.Provider value={{ insertCss }}>
                <Provider key="provider" store={this.store}>
                    <StaticRouter context={context} location={this.location}>
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