import { combineReducers } from "redux";

function storeData(state = {}, action) {
  if (action.type === "STORE_DATA") {
    return action.payload;
  } else {
    return state;
  }
}

const task = combineReducers({
  storeData,
});

export default task;
