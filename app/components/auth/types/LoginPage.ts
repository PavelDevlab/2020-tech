import { Action } from 'redux';
import {FormikHelpers, FormikValues} from "formik/dist/types";

export type LoginValues = {
  login: string,
  password: string,
  form: string
};

export type LoginPersonActionCreator = (payload:{values:FormikValues, actions:FormikHelpers<LoginValues>}) => Action;