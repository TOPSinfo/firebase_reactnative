import { combineReducers } from "@reduxjs/toolkit";
import loading from "./loadingSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
    loading: loading,
    user: userSlice
})

export default rootReducer
