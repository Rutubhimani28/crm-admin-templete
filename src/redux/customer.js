import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'

const initialState = {
    data: [],
    loading: false,
    error: null
}

export const getCustomers = createAsyncThunk(
    'customer/getCustomers',
    async () => {
        try {
            const response = await axiosInstance.get('/coustomer/getCustomers')
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

export const addCustomer = createAsyncThunk(
    'customer/addCustomer',
    async (customer, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/coustomer/addCustomer', customer)
            dispatch(getCustomers())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateCustomer = createAsyncThunk(
    'customer/updateCustomer',
    async (customer, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/coustomer/updateCustomer/${customer._id}`, customer)
            dispatch(getCustomers())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (customer, { dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/coustomer/deleteCustomerById/${customer?._id}`)
            dispatch(getCustomers())
            // return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const viewCustomer = createAsyncThunk(
    'customer/viewCustomer',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/coustomer/viewCustomer/${_id?._id}`)
            const data = await response.data
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(addCustomer.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(viewCustomer.pending, (state) => {
                state.loading = true
            })
            .addCase(viewCustomer.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(viewCustomer.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default customerSlice.reducer