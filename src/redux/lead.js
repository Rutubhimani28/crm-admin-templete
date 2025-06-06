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

export const getLeads = createAsyncThunk(
    'lead/getLeads',
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/leads/getAllLeads/?page=${page}&limit=${pageSize}`)
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

export const addLead = createAsyncThunk(
    'lead/addLead',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/leads/addLead', props)
            dispatch(getLeads({ page: 1, pageSize: 10 }))
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateLead = createAsyncThunk(
    'lead/updateLead',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/leads/updateLeadById/${props?.updatedData?._id}`, props?.updatedData)
            dispatch(getLeads({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }))
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }

    }

)

export const deleteLead = createAsyncThunk(
    'lead/deleteLead',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/leads/deleteLeadById/${props?.selectedForDelete?._id}`)
            dispatch(getLeads({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }))
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
                state.data = action.payload.leads;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
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