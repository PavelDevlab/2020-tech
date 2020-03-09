
import Redux from 'redux';
import isPlainObject from 'lodash.isplainobject';

// Allows us have the privilege to create actions
// with classes instead of action creators.
export const plainObjectMiddleware:Redux.Middleware = () => (next:any) => (a: any) => {
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