import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    languages: [],
    specialities: [],
    devicetoken: '',
  },
  reducers: {
    setLanguages: (state, actions) => {
      state.languages = actions.payload;
    },
    setSpecialities: (state, actions) => {
      state.specialities = actions.payload;
    },
    setDeviceToken: (state, actions) => {
      state.devicetoken = actions.payload;
    },
  },
});

export const { setLanguages, setSpecialities, setDeviceToken } =
  appSlice.actions;

export default appSlice.reducer;
