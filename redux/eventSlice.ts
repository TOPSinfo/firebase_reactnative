import { createSlice } from '@reduxjs/toolkit'

export const eventSlice = createSlice({
    name: 'event',
    initialState: {
        selectedEvent: {
            description: '',
            date: '',
            startTime: '',
            endTime: '',
            notification: '3',
            image: '',
            fullName: '',
            dob: '',
            tob: '',
            place: '',
            kundali: ''
        },
    },
    reducers: {
        setSelectedEvent: (state, actions) => {
            state.selectedEvent = actions.payload
        },
        onChangeEventData: (state, actions) => {
            state.selectedEvent = { ...state.selectedEvent, ...actions.payload }
        }
    },
})

export const { setSelectedEvent, onChangeEventData } = eventSlice.actions

export default eventSlice.reducer