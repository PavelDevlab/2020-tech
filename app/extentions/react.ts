
import {useEffect, EffectCallback, DependencyList} from 'react';
import {AnyFunction} from 'app/types';

export const useIsomorphicEffect = (callback:EffectCallback|AnyFunction, deps?: DependencyList):void => {
  return process.env.IS_SERVER ? callback() : useEffect(callback, deps);
};