
import React from 'react';
import {Link} from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { signedInSelector, SingOutRequest } from 'app/redux/ducks/auth';
import classNames from 'classnames';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from './style.scss';

interface IndexPropTypes {
  signedIn: boolean,
  onLogout: () => void,
};

const Index:React.FunctionComponent<IndexPropTypes> = ({signedIn, children, onLogout}) => {

  return (
    <div className={s['layout']}>

      <div className={classNames(s['layout__header'])}>
        <div className={classNames(s['layout__header-inner'], s['nav'])}>
          <div className={s['nav__logo']}>
            SHOP
          </div>
          <div className={classNames(s['nav__menu'], s['menu'])}>
            <Link to="/" className={classNames(s['menu__item'])}>
              main
            </Link>{' '}
            {signedIn &&
              <>
                {' '}<Link to="/dashboard" className={classNames(s['menu__item'])}>
                  dashboard
                </Link>
              </>}
          </div><div className={classNames(s['nav__side-menu'], s['menu'])}>
            {!signedIn &&<>
              <Link to="/login" className={classNames(s['menu__item'])}>
                login
              </Link>{' '}
              <Link to="/register" className={classNames(s['menu__item'])}>
                register
              </Link>{' '}
            </>}
            {signedIn && <a href="javascript:void(0);" onClick={onLogout}  className={classNames(s['menu__item'])}>
              Sign out
            </a>}
          </div>
        </div>
      </div>
      <div className={s['layout__content']}>
        <div className={s['sheet']}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect((state: Immutable.Map<string, any>) => {
      return {
        signedIn: signedInSelector(state),
      };
    }, (dispatch) => ({
      onLogout() {
        dispatch(new SingOutRequest());
      }
    })
  ),
  withStyles(s)
)(Index as any);