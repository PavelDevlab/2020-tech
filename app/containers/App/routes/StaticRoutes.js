
import UsersGender from './../../pages/UsersGender';
import NotFound from './../../pages/NotFound';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';

const UsersLoadable = Loadable({
  loader: () => import('./../../pages/Users'),
  loading: Loading,
});

export const StaticRoutesConfig = [
  {
    key: 'usersGender',
    component: UsersGender,
    exact: true,
    path: '/users-gender/:gender',
  },
  {
    key: 'USERS',
    component: UsersLoadable,
    exact: true,
    path: '/users',
  },
  {
    key: 'main',
    component: UsersLoadable,
    exact: true,
    path: '/',
  },
  {
    key: 'not-found',
    component: NotFound,
  },
];
