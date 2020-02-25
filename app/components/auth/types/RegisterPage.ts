import { Action } from 'redux';
import {FormikHelpers, FormikValues} from "formik/dist/types";

export type RegisterValues =  {
    login: string,
    password: string,
    passwordRepeat: string/*,
    form: string */
};

export type RegisterPersonActionCreator = (payload:{values:FormikValues, actions:FormikHelpers<RegisterValues>}) => Action;