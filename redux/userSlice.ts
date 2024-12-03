import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    astrologers: [],
    myBookings: [] as any[],
    userType: '',
    selectedSlot: {
      startdate: null,
      enddate: null,
      starttime: null,
      endtime: null,
      type: 'Repeat',
      repeatdays: [],
    },
    appointmentSlots: [] as any[],
    transactionHistory: [] as any[],
    messages: [] as any[],
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
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    resetSelectedSlot: state => {
      state.selectedSlot = {
        startdate: null,
        enddate: null,
        starttime: null,
        endtime: null,
        type: 'Repeat',
        repeatdays: [],
      };
    },
    setAppointmentSlots: (state, action) => {
      state.appointmentSlots = action.payload;
    },
    setTransactionHistory: (state, action) => {
      state.transactionHistory = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    resetMessages: state => {
      state.messages = [];
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
  setSelectedSlot,
  resetSelectedSlot,
  setAppointmentSlots,
  setTransactionHistory,
  setMessages,
  resetMessages,
} = userSlice.actions;

export default userSlice.reducer;
