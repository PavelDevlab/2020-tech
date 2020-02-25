
import { firebaseConfig as rawFirebaseConfig} from './firebaseConfig';

const regToReplace = /\$\$_\$\$/gi;

const clean = (obj:{}) => {
  return Object.keys(obj).reduce((result:any, key) => {
    result[key.replace(regToReplace, "")] = typeof result[key] === 'string' ? (result[key]).replace(regToReplace, "") : result[key];
    return result;
  }, {});
};

export const firebaseConfig = clean(rawFirebaseConfig);

export const appName = 'shop-2020';

