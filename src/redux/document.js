import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'

const initialState = {
    data: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 0
}

export const getAllDocuments = createAsyncThunk(
    'document/getAllDocuments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/documents/getAllDocuments')
            return response.data.files
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const uploadDocument = createAsyncThunk(
    'document/uploadDocument',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/documents/upload', props)
            dispatch(getAllDocuments())
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getAllDocuments.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllDocuments.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(getAllDocuments.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default documentSlice.reducer