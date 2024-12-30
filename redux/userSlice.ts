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
    lastVisibleMessage: null,
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
      state.messages = [...action.payload, ...state.messages];
    },
    updateMessages: (state, action) => {
      const updatedMessages = action.payload;
      state.messages = state.messages.map((message: any) => {
        const updatedMessage = updatedMessages.find(
          (updatedMessage: any) => updatedMessage._id === message._id
        );
        if (updatedMessage) {
          return updatedMessage;
        }
        return message;
      });
    },
    resetMessages: state => {
      state.messages = [];
    },
    setLastVisibleMessage: (state, action) => {
      state.lastVisibleMessage = action.payload;
    },
    setLoadMoreMessages: (state, action) => {
      state.messages = [...state.messages, ...action.payload];
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
  updateMessages,
  resetMessages,
  setLastVisibleMessage,
  setLoadMoreMessages,
} = userSlice.actions;

export default userSlice.reducer;
