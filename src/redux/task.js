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

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/task/getTask/?page=${page}&limit=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "task/addTask",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/task/addTask", props);
      dispatch(getTasks({ page: 1, pageSize: 10 }));
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      console.log(typeof props?.paginationModel?.page,"props")
      const response = await axiosInstance.put(
        `/task/updateTaskById/${props?.updatedData?._id}`,
        props?.updatedData
      );
      dispatch(
        getTasks({
          page:1,
          pageSize: props?.paginationModel?.pageSize,
        })
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (props, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/task/deleteTaskById/${props?.selectedForDelete?._id}`
      );
      dispatch(
        getTasks({
          page: props?.paginationModel?.page + 1,
          pageSize: props?.paginationModel?.pageSize,
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const viewTask = createAsyncThunk(
  "task/viewTask",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/task/viewTask/${_id?._id}`);
      const data = await response.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  tasks: [],
  selectedTask: {},
  initialState,
  reducers: {
    reOrderTasks: (state, action) => {
      state.tasks = action.payload
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.tasks;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload.data);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (task) => task._id !== action.payload._id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(viewTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { reOrderTasks, selectTask } = taskSlice.actions
export default taskSlice.reducer;
