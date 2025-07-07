
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

export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/profile/getProfile");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }   
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (profileData, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/profile/updateProfile", profileData);
            dispatch(getProfile())
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

export const getAllUser = createAsyncThunk(
    'profile/getAllUser',
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/profile/getAllUser/?page=${page}&limit=${pageSize}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
)

export const viewUser = createAsyncThunk(
    'profile/viewUser',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/profile/viewUser/${_id?._id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
)

export const updateuser = createAsyncThunk(
    "profile/updateuser",
    async (props, { dispatch, rejectWithValue }) => {
        console.log("props", props)
        try {
            const response = await axiosInstance.put(
                `/profile/updateUser/${props?.updatedData?._id}`,
                props?.updatedData
            );
            dispatch(
                getAllUser({
                    page: props?.paginationModel?.page + 1,
                    pageSize: props?.paginationModel?.pageSize,
                })
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const contactSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user; // Depends on your API response structure
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.user; // depends on your API response
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.users;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(viewUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(viewUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(viewUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateuser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateuser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateuser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export default contactSlice.reducer
