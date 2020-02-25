
import React, { FunctionComponent } from 'react';
import { Form, Formik, Field } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import PropTypes, { InferProps } from "prop-types";
import { registerPerson } from 'app/redux/ducks/auth';

import { FormikValues, FormikHelpers } from 'formik/dist/types';
import { RegisterValues } from './types/RegisterPage';
import {connect} from 'react-redux';
import {validateWithYup} from 'app/services/utils';

// import {connect} from 'app/extentions/react-redux'; // todo: Make it works.


const initialValues:RegisterValues = {
    login: '',
    password: '',
    passwordRepeat: ''/*,
     form: '' */
};
const loginSchema = Yup.string().email()
  .required("Required");
const validateLogin = validateWithYup((value) => {
    return loginSchema.validateSync(value);
});

const passwordSchema = Yup.string().required("Required");
const validatePassword = validateWithYup((value) => {
    return passwordSchema.validateSync(value);
});

const validatePasswordRepeat = (password:string, passwordRepeat:string):boolean|string => {
    return password === passwordRepeat || "Passwords is not matches";
};
/*
const validationSchema = Yup.object().shape({
    login: loginSchema,
    password: passwordSchema,
    passwordRepeat: Yup.string()
      .test({
          test: function (value) {
              return value === this.parent.password;
          },
          message: "Passwords is not matches"
      })
      .required("Required"),
});

 */


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
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            onSubmit={ onSubmit }
        >
            {(props:FormikProps<RegisterValues>) => (
                <Form>
                    <div>
                        <label>login</label>
                        <Field
                            type="text"
                            name="login"
                            validate={validateLogin}
                            /* onBlur={() => props.validateField("login")} */
                        />
                    </div>
                    {props.errors.login && <div className="field-error">{props.errors.login}</div>}
                    <div>
                        <label>password</label>
                        <Field
                            type="password"
                            name="password"
                            validate={validatePassword}
                            /*onBlur={() => props.validateField("password")}*/
                        />
                    </div>
                    {props.errors.password && <div className="field-error">{props.errors.password}</div>}
                    <div>
                        <label>password repeat</label>
                        <Field
                            type="password"
                            name="passwordRepeat"
                            validate={(value: any) => validatePasswordRepeat(props.values.password, value)}
                            /* onBlur={() => props.validateField("passwordRepeat")} */
                        />
                    </div>
                    {props.errors.passwordRepeat && <div className="field-error">{props.errors.passwordRepeat}</div>}
                    <button type="submit" disabled={props.isSubmitting}>
                        Submit
                    </button>
                    {/*
                    <div>
                        {props.errors.form && <div className="field-error">{props.errors.form}</div>}
                    </div>
                    */}
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