
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

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export function compose<T1, T2>(
    f : (x : T1) => T2
) : (x : T1) => T2;
export function compose<T1, T2, T3>(
    f : (x : T2) => T3,
    g : (x : T1) => T2
) : (x : T1) => T3;
export function compose<T1, T2, T3, T4>(
    f : (x : T3) => T4,
    g : (x : T2) => T3,
    h : (x : T1) => T2
) : (x : T1) => T4;
export function compose<T1, T2, T3, T4, T5>(
    f : (x : T4) => T5,
    g : (x : T3) => T4,
    h : (x : T2) => T3,
    k : (x : T1) => T2
) : (x : T1) => T5;
export function compose<T1, T2, T3, T4, T5, T6>(
    f : (x : T5) => T6,
    g : (x : T4) => T5,
    h : (x : T3) => T4,
    k : (x : T2) => T3,
    l : (x : T1) => T2
) : (x : T1) => T6;
export function compose<T1, T2, T3, T4, T5, T6, T7>(
    f : (x : T6) => T7,
    g : (x : T5) => T6,
    h : (x : T4) => T5,
    k : (x : T3) => T4,
    l : (x : T2) => T3,
    m : (x : T1) => T2
) : (x : T1) => T7;
export function compose (fn1:any, ...fns:any[]):any {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return fns.reduce((prevFn, nextFn) => (value: any) => prevFn(nextFn(value)), fn1);
}


/*
export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    value => value
  );
  return (...args: T) => piped(fn1(...args));
};


type AnyFunction = (...args:any[]) => any;
// type FunctionResult<F> = F extends (...args:any[]) => infer T ? T : never;
// type FunctionFirstArg<F> = F extends (arg0: infer T, ...args:any[]) => any ? T : never;
type FunctionResultWithArg<F, P> = F extends (arg0: P, ...args:any[]) => infer T ? T : never;
type ComposeType = <F1 extends AnyFunction|void, F2 extends AnyFunction|void, F3 extends AnyFunction|void>(f1?:F1, f2?:F2, f3?:F3) =>
    F1 extends void ? <A>(arg0: A) => A :
    F2 extends void ? <A>(arg0: A) => FunctionResultWithArg<F1, A> :
    F3 extends void ? <A>(arg0: A) => FunctionResultWithArg<F1, FunctionResultWithArg<F2, A>> :
                      <A>(arg0:A) => FunctionResultWithArg<F1, FunctionResultWithArg<F2, FunctionResultWithArg<F3, A>>>;


export const compose:ComposeType = (
    fn1?,
    fn2?,
    fn3?
) => {
  //return (value) => {
    if (fn1 === undefined) {
      return (a:any) => a;
    }
    if (fn2 === undefined) {
      return (a:any) => fn1(a);
    }
    if (fn3 === undefined) {
      return (a:any) => fn1(fn2(a));
    }
    return (a:any) => fn1(fn2(fn3(a)));
  // };
};

/*
export const compose = (...fns) => {
  if (fns.length === 1) {
    return fns[0];
  }
  if (fns.length > 1) {
    const f1 = fns[0];
    const f2 = fns[1];
    const rest = fns.slice(2);
    return compose(f2(f1), ...rest);
  }
};*/

/*
export const compose:ComposeType = (fn1, ...fns) =>
    fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);
/*


/*
export const compose = (...fns:Function[]) => {
  const fn1 = fns[0];
  return fns.slice(1).reduce((prevFn, nextFn) => {
       return (value) => prevFn(nextFn(value));
  }, fn1);
};
/*
export const compose = <F1, F2, >(fn1: F1, ...fns: Array<(a: R) => R>) => {
   fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);
};
 */
    
/*
export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

 */