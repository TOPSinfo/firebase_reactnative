import { createSlice } from '@reduxjs/toolkit';

export const eventSlice = createSlice({
  name: 'event',
  initialState: {
    selectedEvent: {
      description: '',
      date: '',
      starttime: '',
      endtime: '',
      notificationmin: '10',
      notify: '10 minutes before',
      photo: '',
      fullname: '',
      birthdate: '',
      birthtime: '',
      birthplace: '',
      kundali: '',
      phone: '',
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
        starttime: '',
        endtime: '',
        notificationmin: '10',
        notify: '10 minutes before',
        photo: '',
        fullname: '',
        birthdate: '',
        birthtime: '',
        birthplace: '',
        kundali: '',
        phone: '',
      };
    },
    updateSelectedEvent: (state, actions) => {
      state.selectedEvent = {
        ...state.selectedEvent,
        phone: actions.payload,
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
