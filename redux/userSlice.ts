import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        astrologers: [],
        myBookings: []
    },
    reducers: {
        setUser: (state, actions) => {
            state.userData = actions.payload
        },
        setAstrologers: (state, actions) => {
            state.astrologers = actions.payload
        },
        setMyBookings: (state, actions) => {
            state.myBookings = actions.payload
        }
    },
})

export const { setUser, setAstrologers, setMyBookings } = userSlice.actions

export default userSlice.reducer