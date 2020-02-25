
import { firebaseConfig as rawFirebaseConfig} from './firebaseConfig';
import { PlainObject } from 'app/types';

const regToReplace = /\$\$_\$\$/gi;

const clean = (obj:PlainObject) => {
  return Object.keys(obj).reduce((result:any, key) => {
    result[key.replace(regToReplace, "")] = typeof obj[key] === 'string' ? (obj[key]).replace(regToReplace, "") : obj[key];
    return result;
  }, {});
};

export const firebaseConfig = clean(rawFirebaseConfig);

export const appName = 'shop-2020';

