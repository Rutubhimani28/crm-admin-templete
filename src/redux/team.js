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
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/team/getAllTeam/?page=${page}&limit=${pageSize}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addTeam = createAsyncThunk(
    'team/addTeam',
    async (team, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/team/addTeam', team)
            dispatch(getTeam({ page: 1, pageSize: 10 }))
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
            dispatch(getTeam({ page: 1, pageSize: 10 }))
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteTeam = createAsyncThunk(
    'team/deleteTeam',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/team/deleteTeamById/${props?.selectedForDelete?._id}`)
            dispatch(getTeam({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }));
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
                state.data = action.payload.teams;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
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