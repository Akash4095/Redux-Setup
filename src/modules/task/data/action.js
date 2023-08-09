import * as type from './types'

export function getData(data) {
    return {
        type: type.GET_DATA,
        payload: data
    };
}