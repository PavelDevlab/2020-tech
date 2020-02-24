import 'babel-polyfill';

import Loadable from 'react-loadable';
import express from 'express';
import SSRenderer from './SSRenderer';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('./build/public'));

app.get('*', (req, res) => {
    const url = req.originalUrl || req.url;
    const renderer = new SSRenderer({
        url
    });
    renderer.render()
        .then(({status, html}) => {
            res.status(status).send(html);
        }).catch(() => {
            res.status(500).send('Oops, better luck next time!');
        });
});

Loadable.preloadAll().then(() => {
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`😎 Server is listening on port ${PORT}`);
    });
});
