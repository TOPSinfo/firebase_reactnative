import { combineReducers } from "@reduxjs/toolkit";
import loading from "./loadingSlice";
import userSlice from "./userSlice";
import eventSlice from "./eventSlice";

const rootReducer = combineReducers({
    loading: loading,
    user: userSlice,
    event: eventSlice
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
