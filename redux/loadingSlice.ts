import { createSlice } from '@reduxjs/toolkit'

export const loading = createSlice({
    name: 'loading',
    initialState: {
        isLoading: false,
    },
    reducers: {
        setLoading: (state, actions) => {
            state.isLoading = actions.payload
        }
    },
})

export const { setLoading } = loading.actions

export default loading.reducer