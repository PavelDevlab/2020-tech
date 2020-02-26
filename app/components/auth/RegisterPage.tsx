
import React, { FunctionComponent } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import PropTypes, { InferProps } from "prop-types";
import { registerPerson } from 'app/redux/ducks/auth';

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
                <Form>
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

                    <div>
                      <label>password repeat</label>
                      <Field
                        type="password"
                        name="passwordRepeat"
                      />
                    </div>
                    <ErrorMessage name="passwordRepeat" />
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
    )(RegisterPage as any)
);