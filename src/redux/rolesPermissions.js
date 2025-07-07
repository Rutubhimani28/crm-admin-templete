
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

export const addRoles = createAsyncThunk(
    'roles/addRoles',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/rolesPermissions/addRole", props);
            // const roleData = response?.data?.role || response?.data;
            // if (roleData) {
            //     localStorage.setItem('createdRole', JSON.stringify(roleData));
            // }
            dispatch(getAllRoles({ page: 1, pageSize: 10 }))
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

export const getAllRoles = createAsyncThunk(
    'roles/getAllRoles',
    async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/rolesPermissions/getAllRoles/?page=${page}&limit=${pageSize}`)
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

export const updateRoles = createAsyncThunk(
    'roles/updateRoles',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/rolesPermissions/updateRole/${props?.updatedData?._id}`, props?.updatedData)
            const roleData = response?.data?.role || response?.data;
            if (roleData) {
                localStorage.setItem('createdRole', JSON.stringify(roleData));
            }
            dispatch(getAllRoles({ page: props?.paginationModel?.page + 1, pageSize: props?.paginationModel?.pageSize }))
            return response
        } catch (error) {
            return rejectWithValue(error.message)
        }

    }
)

export const getRolePermissions = createAsyncThunk(
    'roles/getPermissions',
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/rolesPermissions/getRolePermissions/${roleId}/permissions`);
            return response.data;
        } catch (err) {
            console.log("err", err)
            return rejectWithValue(err.response.data);
        }
    }
);
const rolesPermissionsSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addRoles.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addRoles.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addRoles.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getAllRoles.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllRoles.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.role;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAllRoles.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateRoles.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateRoles.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(updateRoles.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(getRolePermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRolePermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions = action.payload;
            })
            .addCase(getRolePermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export default rolesPermissionsSlice.reducer
