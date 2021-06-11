import { combineReducers } from "redux";
import AuthReducer from "./auth";
import ApplicationReducer from "./application";
import MediaReducer from "./media";

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  media: MediaReducer
});
