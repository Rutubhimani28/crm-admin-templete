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

export const getProposal = createAsyncThunk(
    'proposal/getProposal',
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/proposal/getAllProposals/?page=${page}&limit=${pageSize}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addProposal = createAsyncThunk(
    'proposal/addProposal',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/proposal/addProposal', props)
            dispatch(getProposal({ page: 1, pageSize: 10 }))
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateProposal = createAsyncThunk(
    'proposal/updateProposal',
    async ({ updatedData }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/proposal/updateProposal/${updatedData._id}`, updatedData);
            dispatch(getProposal({ page: 1, pageSize: 10 }));
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProposal = createAsyncThunk(
    'proposal/deleteProposal',
    async (id, { dispatch, rejectWithValue }) => {
        console.log("id", id)
        try {
            await axiosInstance.delete(`/proposal/deleteProposal/${id?.selectedForDelete?._id}`);
            dispatch(getProposal({ page: 1, pageSize: 10 }));
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getProposalById = createAsyncThunk(
    'proposal/getAllProposals',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/proposal/getOneProposal/${_id?._id}`);
            const data = await response.data;
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const proposalSlice = createSlice({
    name: 'proposal',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getProposal.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getProposal.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.proposals;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProposal.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(addProposal.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addProposal.fulfilled, (state, action) => {
                state.loading = false
                // state.data.push(action.payload.data);

            })
            .addCase(addProposal.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateProposal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProposal.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProposal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteProposal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProposal.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProposal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getProposalById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProposalById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getProposalById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }

})

export default proposalSlice.reducer