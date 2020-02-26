
import React, { FunctionComponent } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import PropTypes, { InferProps } from "prop-types";
import { loginPerson } from 'app/redux/ducks/auth';

import { FormikValues, FormikHelpers } from 'formik/dist/types';
import { LoginValues } from './types/LoginPage';
import {connect} from 'react-redux';

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

const propTypes = {
    onSubmit: PropTypes.func.isRequired
};

const defaultProps = {
    onSubmit: () => null
};

type LoginPageProps = InferProps<typeof propTypes>;


const LoginPage:FunctionComponent<LoginPageProps> = ({ onSubmit }: LoginPageProps) => {

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={ onSubmit }
      >
          {(props:FormikProps<LoginValues>) => (
            <Form>
                <h2>
                  Sign in
                </h2>
                <div>
                    <label>login</label>
                    <Field
                      type="text"
                      name="login"
                    />
                </div>
                <ErrorMessage name="login" />
                <div>
                    <label>password</label>
                    <Field
                      type="password"
                      name="password"
                    />
                </div>
                <ErrorMessage name="password" />
                <br />
                <button type="submit"
                        disabled={props.isSubmitting}>
                    Submit
                </button>
                <br />
                <br />
                <ErrorMessage name="form" />
            </Form>
          )}
      </Formik>
    );
};

LoginPage.propTypes = propTypes;
LoginPage.defaultProps = defaultProps;

export default compose(
  connect(
    null,
    (dispatch) => {
        return {
            onSubmit(values:FormikValues, actions:FormikHelpers<LoginValues>) {
                dispatch((loginPerson({ values, actions })));
            }
        };
    }
  )(LoginPage as any)
);