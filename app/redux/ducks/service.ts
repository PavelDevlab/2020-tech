
export enum ServiceActionType {
  PreEnd = "$$$PRE_END$$$"
}

interface PreEndAction {
  type: ServiceActionType.PreEnd
}
export type PreEndActionCreator = () => PreEndAction
export const preEnd:PreEndActionCreator = () => {
  return {
    type: ServiceActionType.PreEnd
  };
};