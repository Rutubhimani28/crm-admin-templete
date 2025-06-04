
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

export const getContacts = createAsyncThunk(
    'contact/getContacts',
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/contacts/getAllContacts/?page=${page}&limit=${pageSize}`)
            const data = await response.data
            return data
        } catch (error) {
            return rejectWithValue(error.message);

        }
    });

export const addContact = createAsyncThunk(
    'contact/addContact',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/contacts/addContact', props)
            const data = await response.data
            dispatch(getContacts({ page: 1, pageSize: 10 }))
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

export const updateContact = createAsyncThunk(
    'contact/updateContact',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/contacts/updateContact/${props?.updatedData?._id}`, props?.updatedData)
            const data = await response.data
            dispatch(getContacts({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }))
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

export const deleteContact = createAsyncThunk(
    'contact/deleteContact',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/contacts/deleteContact/${props?.selectedForDelete?._id}`)
            dispatch(getContacts({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }))
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

export const contactView = createAsyncThunk(
    'contact/viewContact',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/contacts/contactView/${_id?._id}`)
            const data = await response.data
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getContacts.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getContacts.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.contacts;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getContacts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            .addCase(addContact.pending, (state, action) => {
                state.loading = true
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addContact.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateContact.pending, (state, action) => {
                state.loading = true
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(updateContact.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteContact.pending, (state, action) => {
                state.loading = true
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(deleteContact.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(contactView.pending, (state, action) => {
                state.loading = true
            })
            .addCase(contactView.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(contactView.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default contactSlice.reducer
