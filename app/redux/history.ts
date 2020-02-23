import { createBrowserHistory, createMemoryHistory } from 'history';

const history = process.env.IS_SERVER
    ? createMemoryHistory({
        initialEntries: ['/'],
    })
    : createBrowserHistory();

export default history;