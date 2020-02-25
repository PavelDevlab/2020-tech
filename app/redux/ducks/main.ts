
/**
 * Constants
 * */
export const moduleName = ''
const prefix = `{appName}/{moduleName}`

export const ADD_PERSON_REQUEST = `{prefix}/ADD_PERSON_REQUEST`

/**
 * Reducer
 * */
export default function reducer(state = {}, action) {
    const {type, payload} = action

    switch (type) {
        case ADD_PERSON_REQUEST:

        default:
            return state
    }
}

/**
 * Selectors
 * */
export const peopleListSelector = (state) => state[moduleName].entities.valueSeq().toArray()

/**
 * Action Creators
 * */

/**
 * Sagas
 * */
