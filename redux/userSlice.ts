import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        astrologers: [],
    },
    reducers: {
        setUser: (state, actions) => {
            state.userData = actions.payload
        },
        setAstrologers: (state, actions) => {
            state.astrologers = actions.payload
        }
    },
})

export const { setUser, setAstrologers } = userSlice.actions

export default userSlice.reducer