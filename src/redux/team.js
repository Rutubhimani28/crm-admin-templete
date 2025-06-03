import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'

const initialState = {
    data: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 0
};
export const getTeam = createAsyncThunk(
    'team/getTeam',
    async () => {
        try {
            const response = await axiosInstance.get(`/team/getAllTeam`);
            return response.data; // make sure your backend sends { teams, total, totalPages, etc. }
        } catch (error) {
            // return rejectWithValue(error.message);
        }
    }
);

export const addTeam = createAsyncThunk(
    'team/addTeam',
    async (team, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/team/addTeam', team)
            dispatch(getTeam())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateTeam = createAsyncThunk(
    'team/updateTeam',
    async (team, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/team/updateTeamById/${team._id}`, team)
            dispatch(getTeam())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteTeam = createAsyncThunk(
    'team/deleteTeam',
    async (team, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/team/deleteTeamById/${team?._id}`)
            dispatch(getTeam())
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const viewTeam = createAsyncThunk(
    'team/viewTeam',
    async (_id, { rejectWithValue }) => {
        console.log('viewTeam thunk called')
        try {
            const response = await axiosInstance.get(`/team/viewTeamById/${_id?._id}`)
            const data = await response.data
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getTeam.pending, (state) => {
                state.loading = true
            })
            .addCase(getTeam.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(getTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(addTeam.pending, (state) => {
                state.loading = true
            })
            .addCase(addTeam.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateTeam.pending, (state) => {
                state.loading = true
            })
            .addCase(updateTeam.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(updateTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteTeam.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(viewTeam.pending, (state) => {
                state.loading = true
            })
            .addCase(viewTeam.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(viewTeam.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default teamSlice.reducer