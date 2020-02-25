
import React, { FunctionComponent } from 'react';
import { Formik, Field } from 'formik';
import { FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { compose } from 'redux';
import PropTypes, { InferProps } from "prop-types";
import { registerPerson } from 'app/redux/ducks/auth';

import { FormikValues, FormikHelpers } from 'formik/dist/types';
import { RegisterValues } from './types/RegisterPage';
import {connect} from 'react-redux';

// import {connect} from 'app/extentions/react-redux'; // todo: Make it works.


const initialValues:RegisterValues = {
    login: '',
    password: '',
    passwordRepeat: '',
};

const validationSchema = Yup.object().shape({
    login: Yup.string()
        .email()
        .required("Required"),
    password: Yup.string()
        .required("Required"),
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

// const storeEnhancer = ;



const RegisterPage:FunctionComponent<RegisterPageProps> = ({ onSubmit }: RegisterPageProps) => {

    /*
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
    }, []);
    */

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={ onSubmit }
            validationSchema={validationSchema}
        >
            {(props:FormikProps<RegisterValues>) => (
                <form onSubmit={props.handleSubmit}>
                    <div>
                        <label>login</label>
                        <Field
                            type="text"
                            name="login"
                        />
                    </div>
                    {props.errors.login && <div className="field-error">{props.errors.login}</div>}
                    <div>
                        <label>password</label>
                        <Field
                            type="password"
                            name="password"
                        />
                    </div>
                    {props.errors.password && <div className="field-error">{props.errors.password}</div>}
                    <div>
                        <label>password repeat</label>
                        <Field
                            type="password"
                            name="passwordRepeat"
                        />
                    </div>
                    {props.errors.passwordRepeat && <div className="field-error">{props.errors.passwordRepeat}</div>}
                    <button type="submit" disabled={props.isSubmitting}>
                        Submit
                    </button>
                </form>
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

/*
export default compose(
    storeEnhancer
)(RegisterPage);
 */