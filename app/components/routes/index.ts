
// import React from 'react';

import App from 'components/App';
import Temp from 'components/Temp';
import NotFound from 'components/NotFound';
import RegisterPage from 'components/auth/RegisterPage';
import LoginPage from 'components/auth/LoginPage';
import RecoverPage from 'components/auth/RecoverPage';
import Dashboard from 'components/shop/Dashboard';
import { RouteConfig } from 'react-router-config';

/*
import Loadable from 'react-loadable';
import Loading from 'components/Loading';

const UsersLoadable = Loadable({
  loader: () => import('./../../pages/Users'),
  loading: Loading,
});
*/


const routes:RouteConfig = [
  {
    path: '/',
    component: App,
    routes: [
      {
        key: 'main',
        component: Temp,
        exact: true,
        path: '/',
      },
      {
        key: 'authRegister',
        component: RegisterPage,
        exact: true,
        path: '/register',
      },
      {
        key: 'authLogin',
        component: LoginPage,
        exact: true,
        path: '/login',
      },
      {
        key: 'authRecover',
        component: RecoverPage,
        exact: true,
        path: '/recover',
      },
      {
        key: 'dashboard',
        component: Dashboard,
        exact: true,
        path: "/dashboard"
      },
      {
        key: 'not-found',
        component: NotFound,
        path: '*',
      },
    ],
  },
];

export default routes;
