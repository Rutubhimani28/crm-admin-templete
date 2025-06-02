import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'

const initialState = {
    data: [],
    loading: false,
    error: null
}

export const getLeads = createAsyncThunk(
    'lead/getLeads',
    async () => {
        try {
            const response = await axiosInstance.get('/leads/getAllLeads')
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

export const addLead = createAsyncThunk(
    'lead/addLead',
    async (lead, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/leads/addLead', lead)
            dispatch(getLeads())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateLead = createAsyncThunk(
    'lead/updateLead',
    async (lead, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/leads/updateLeadById/${lead._id}`, lead)
            dispatch(getLeads())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }

    }

)

export const deleteLead = createAsyncThunk(
    'lead/deleteLead',
    async (lead, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/leads/deleteLeadById/${lead?._id}`)
            dispatch(getLeads())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const viewLead = createAsyncThunk(
    'lead/viewLead',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/leads/leadView/${_id?._id}`)
            const data = await response.data
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const leadSlice = createSlice({
    name: 'lead',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getLeads.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getLeads.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(getLeads.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(addLead.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addLead.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addLead.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateLead.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(updateLead.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteLead.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(deleteLead.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(viewLead.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(viewLead.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(viewLead.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

    }
})

export default leadSlice.reducer