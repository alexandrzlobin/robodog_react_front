import { legacy_createStore as createStore, combineReducers } from 'redux'
import robotReducer from "./robot-reducer";

let store = createStore(combineReducers({
    robotReducer: robotReducer,
}));

window.store = store.getState();
export default store;
