import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    astrologers: [],
    myBookings: [],
    userType: '',
  },
  reducers: {
    setUser: (state, actions) => {
      state.userData = actions.payload;
    },
    setAstrologers: (state, actions) => {
      state.astrologers = actions.payload;
    },
    setMyBookings: (state, actions) => {
      state.myBookings = actions.payload;
    },
    updateProfileImage: (state, actions) => {
      state.userData = {
        ...(typeof state.userData === 'object' && state.userData !== null
          ? state.userData
          : {}),
        ...(typeof actions.payload === 'object' && actions.payload !== null
          ? actions.payload
          : {}),
      };
    },
    setUserType: (state, actions) => {
      state.userType = actions.payload;
    },
  },
});

export const {
  setUser,
  setAstrologers,
  setMyBookings,
  updateProfileImage,
  setUserType,
} = userSlice.actions;

export default userSlice.reducer;
