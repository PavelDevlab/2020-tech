
import {AnyFunction} from 'app/types';

const callbackStub = () => null;
export const once = (callback: AnyFunction):AnyFunction => {
  let targetCallback = callback;
  return () => {
    targetCallback();
    targetCallback = callbackStub;
  };
};

export const validateWithYup:(arg0:AnyFunction) => ((arg0:any) => any) = (validate) => {
    return (value) => {
      try {
        validate(value);
      } catch (error) {
        return error.errors[0] || 'Error';
      }
    };
};