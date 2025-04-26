import { combineReducers } from "redux";
import userActivityReducer from "./userActivityReducer";
import handleUserReducer from "./handleuserReducer";

const rootReducer = combineReducers({
  useractivity: userActivityReducer,
  userDetails: handleUserReducer,
});

export default rootReducer;
