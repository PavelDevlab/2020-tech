
import React, { FunctionComponent } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import PropTypes, { InferProps } from "prop-types";
import { registerPerson } from 'app/redux/ducks/auth';

import classNames from 'classnames';

import withStyles from 'isomorphic-style-loader/withStyles';
import s from 'app/components/common/form.scss';

import { FormikValues, FormikHelpers } from 'formik/dist/types';
import { RegisterValues } from './types/RegisterPage';
import {connect} from 'react-redux';


const initialValues:RegisterValues = {
    login: '',
    password: '',
    passwordRepeat: '',
    form: ''
};

const validationSchema = Yup.object().shape({
    login: Yup.string().email()
      .required("Required"),
    password: Yup.string().required("Required"),
    passwordRepeat: Yup.string()
      .test({
          test: function (value) {
              return value === this.parent.password;
          },
          message: "Passwords is not matches"
      })
      .required("Required"),
});

const propTypes = {
    onSubmit: PropTypes.func.isRequired
};

const defaultProps = {
    onSubmit: () => null
};

type RegisterPageProps = InferProps<typeof propTypes>;


const RegisterPage:FunctionComponent<RegisterPageProps> = ({ onSubmit }: RegisterPageProps) => {

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={ onSubmit }
        >
            {(props:FormikProps<RegisterValues>) => (
              <div>
                <Form className={classNames(s['form'], s['_compact'])}>
                    <h3>
                      Sign up
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

                    <div className={classNames(s['field-group'])}>
                      <label className={s['label']}>password repeat</label>
                      <Field
                        className={s['input']}
                        type="password"
                        name="passwordRepeat"
                      />
                      <div className={classNames(s['error'])}>
                        <ErrorMessage name="passwordRepeat" />
                      </div>
                    </div>
                    <button type="submit"
                            className={s['btn']}
                            disabled={props.isSubmitting}>
                        Sign up
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

RegisterPage.propTypes = propTypes;
RegisterPage.defaultProps = defaultProps;

export default compose(
    connect(
        null,
        (dispatch) => {
            return {
                onSubmit(values:FormikValues, actions:FormikHelpers<RegisterValues>) {
                    dispatch((registerPerson({ values, actions })));
                }
            };
        }
    ),
    withStyles(s)
)(RegisterPage as any);