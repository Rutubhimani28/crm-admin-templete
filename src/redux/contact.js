
// src/redux/contact/contactSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'

const initialState = {
    data: [],
    loading: false,
    error: null
}

export const getContacts = createAsyncThunk(
    'contact/getContacts',
    async () => {
        try {
            const response = await axiosInstance.get('/contacts/getAllContacts')
            const data = await response.data
            return data
        } catch (error) {
            throw error
        }
    });

export const addContact = createAsyncThunk(
    'contact/addContact',
    async (contact, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/contacts/addContact', contact)
            const data = await response.data
            dispatch(getContacts())
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

export const updateContact = createAsyncThunk(
    'contact/updateContact',
    async (contact, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/contacts/updateContact/${contact._id}`, contact)
            const data = await response.data
            dispatch(getContacts())
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    });

export const deleteContact = createAsyncThunk(
    'contact/deleteContact',
    async (contact, { dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/contacts/deleteContact/${contact._id}`)
            dispatch(getContacts())
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
                state.data = action.payload
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
