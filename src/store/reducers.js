import { combineReducers } from "redux";
import task from "../modules/task/data/reducers"

const rootReducer = () => combineReducers({
    task,
});

export default rootReducer;
