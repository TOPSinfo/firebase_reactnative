import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    astrologers: [],
    myBookings: [] as any[],
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
    updateBookingStatus: (state, actions) => {
      state.myBookings = state.myBookings.map((booking: any) => {
        if (booking.id === actions.payload.id) {
          return {
            ...booking,
            status: actions.payload.status,
          };
        }
        return booking;
      });
    },
  },
});

export const {
  setUser,
  setAstrologers,
  setMyBookings,
  updateProfileImage,
  setUserType,
  updateBookingStatus,
} = userSlice.actions;

export default userSlice.reducer;
