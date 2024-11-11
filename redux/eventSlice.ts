import { createSlice } from '@reduxjs/toolkit';

export const eventSlice = createSlice({
  name: 'event',
  initialState: {
    selectedEvent: {
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      notificationType: '3',
      image: '',
      fullName: '',
      dob: '',
      tob: '',
      place: '',
      kundali: '',
      phoneNumber: '',
    },
  },
  reducers: {
    setSelectedEvent: (state, actions) => {
      state.selectedEvent = actions.payload;
    },
    onChangeEventData: (state, actions) => {
      state.selectedEvent = { ...state.selectedEvent, ...actions.payload };
    },
    resetSelectedEvent: state => {
      state.selectedEvent = {
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        notificationType: '3',
        image: '',
        fullName: '',
        dob: '',
        tob: '',
        place: '',
        kundali: '',
        phoneNumber: '',
      };
    },
    updateSelectedEvent: (state, actions) => {
      state.selectedEvent = {
        ...state.selectedEvent,
        phoneNumber: actions.payload,
      };
    },
  },
});

export const {
  setSelectedEvent,
  onChangeEventData,
  resetSelectedEvent,
  updateSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
