import { combineReducers, legacy_createStore as createStore } from "redux";
import userReducer from "./reduces/user";

//여러 리덕스 결합

const allReducers=combineReducers({
    user: userReducer 
})

const store = createStore(allReducers);

export default store;