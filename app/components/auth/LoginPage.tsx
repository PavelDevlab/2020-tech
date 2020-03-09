
import React, { FunctionComponent } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import { LoginPerson } from 'app/redux/ducks/auth';

import { FormikValues, FormikHelpers } from 'formik/dist/types';
import { LoginValues } from './types/LoginPage';
import {connect} from 'react-redux';


import classNames from 'classnames';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from 'app/components/common/form.scss';

const initialValues:LoginValues = {
    login: '',
    password: '',
    form: ''
};

const validationSchema = Yup.object().shape({
    login: Yup.string().email()
      .required("Required"),
    password: Yup.string().required("Required"),
});

interface LoginPagePropTypes {
    onSubmit: (values:FormikValues, actions:FormikHelpers<LoginValues>) => void
};

const LoginPage:FunctionComponent<LoginPagePropTypes> = ({ onSubmit }) => {

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={ onSubmit }
      >
          {(props:FormikProps<LoginValues>) => (
            <div>
              <Form className={classNames(s['form'], s['_compact'])}>
                  <h3>
                    Sign in
                  </h3>
                  <div className={classNames(s['field-group'])}>
                      <label className={s['label']}>login</label>
                      <Field
                        className={s['input']}
                        type="text"
                        name="login"
                      />
                      <div className={classNames(s['error'])}>
                          <ErrorMessage name="login" />
                      </div>
                  </div>
                  <div className={classNames(s['field-group'])}>
                      <label className={s['label']}>password</label>
                      <Field
                        className={s['input']}
                        type="password"
                        name="password"
                      />
                      <div className={classNames(s['error'])}>
                          <ErrorMessage name="password" />
                      </div>
                  </div>
                  <button type="submit"
                          className={s['btn']}
                          disabled={props.isSubmitting}>
                      Sign in
                  </button>
              </Form>
              <div className={classNames(s['error'], s['_big'], s['form__result-error'])}>
                <ErrorMessage name="form" />
              </div>
            </div>
          )}
      </Formik>
    );
};

export default compose(
  connect(
    null,
    (dispatch) => {
        return {
            onSubmit(values:LoginValues, actions:FormikHelpers<LoginValues>) {
                dispatch(new LoginPerson(values, actions));
            }
        };
    }
  ),
  withStyles(s)
)(LoginPage as any);