
export type AnyFunction = (...args: any[]) => any;

export type PlainObject = { [name: string]: any };
export type PlainObjectOf<T> = { [name: string]: T };