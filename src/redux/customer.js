import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../auth/axiosInstance";

const initialState = {
  data: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/coustomer/getCustomers/?page=${page}&limit=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customer/addCustomer",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/coustomer/addCustomer",
        props
      );
      dispatch(getCustomers({ page: 1, pageSize: 10 }));
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/coustomer/updateCustomer/${props?.updatedData?._id}`,
        props?.updatedData
      );
      dispatch(
        getCustomers({
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

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/coustomer/deleteCustomerById/${props?.selectedForDelete?._id}`
      );
      dispatch(
        getCustomers({
          page: props?.paginationModel?.page + 1,
          pageSize: props?.paginationModel?.pageSize,
        })
      );
      // return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const viewCustomer = createAsyncThunk(
  "customer/viewCustomer",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/coustomer/viewCustomer/${_id?._id}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.customers;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(viewCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
