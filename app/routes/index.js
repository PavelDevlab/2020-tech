
import React from 'react';

import App from 'components/App';
import Temp from 'components/Temp';
import NotFound from 'components/NotFound';

/*
import Loadable from 'react-loadable';
import Loading from 'components/Loading';

const UsersLoadable = Loadable({
  loader: () => import('./../../pages/Users'),
  loading: Loading,
});

 */


const routes = [
  {
    path: '/',
    component: App,
    routes: [
      {
        key: 'usersGender',
        component: Temp,
        exact: true,
        path: '/',
      },
      {
        key: 'not-found',
        component: NotFound,
      },
    ],
  },
];

export default routes;