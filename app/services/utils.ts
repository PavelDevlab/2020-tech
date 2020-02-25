
import {AnyFunction} from 'app/types';

const callbackStub = () => null;
export const once = (callback: AnyFunction):AnyFunction => {
  let targetCallback = callback;
  return () => {
    targetCallback();
    targetCallback = callbackStub;
  };
};