import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    languages: [],
    specialities: [],
  },
  reducers: {
    setLanguages: (state, actions) => {
      state.languages = actions.payload;
    },
    setSpecialities: (state, actions) => {
      state.specialities = actions.payload;
    },
  },
});

export const { setLanguages, setSpecialities } = appSlice.actions;

export default appSlice.reducer;
