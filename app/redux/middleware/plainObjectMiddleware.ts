
import Redux from 'redux';
import isPlainObject from 'lodash.isplainobject';
import { StoreRecord } from 'app/redux/reducer';

// Allows us have the privilege to create actions
// with classes instead of action creators.
export const plainObjectMiddleware:Redux.Middleware = (/*{ getState }: Redux.MiddlewareAPI<StoreRecord>*/) =>
    (next:Redux.Dispatch<StoreRecord>) =>
        <A extends Redux.Action>(a: A):A => {
    if (!isPlainObject(a)) {
        const result: any = {};
        // We don't need hasOwnProperty and we know what we are doing.
        // tslint:disable
        for (const prop in a) {
            result[prop] = a[prop];
        }
        // tslint:enable
        a = result;
    }
    return next(a);
};