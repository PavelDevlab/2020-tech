import { Action as ReduxAction} from 'redux';

export type Action = ReduxAction & {
    payload?: any,
    meta?: any,
    error?: boolean
}