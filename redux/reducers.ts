import { combineReducers } from '@reduxjs/toolkit';
import loading from './loadingSlice';
import userSlice from './userSlice';
import eventSlice from './eventSlice';
import appSlice from './appSlice';

const rootReducer = combineReducers({
  loading: loading,
  user: userSlice,
  event: eventSlice,
  app: appSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
