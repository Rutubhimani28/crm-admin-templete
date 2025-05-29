import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../auth/axiosInstance'; // Adjust path


const initialState = {
  userData: JSON.parse(localStorage.getItem('userData')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null
}

export const fetchUserData = createAsyncThunk(
  'authentication/fetchUserData',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/register', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchsingUserData = createAsyncThunk(
  'authentication/fetchsingUserData',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/login', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const logout = createAsyncThunk(
  'authentication/logout',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/logout', payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }

)

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ id, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password`,
        { id, password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to reset password"
      );
    }
  }
);



const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken

      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    handleLogout: (state) => {
      state.userData = null
      state.accessToken = null
      state.refreshToken = null

      localStorage.removeItem('userData')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false
        state.userData = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Login
      .addCase(fetchsingUserData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchsingUserData.fulfilled, (state, action) => {
        state.isLoading = false
        state.userData = action.payload
      })
      .addCase(fetchsingUserData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.userData = null
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('userData')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
  }
})


export const { handleLogin, handleLogout } = authSlice.actions
export default authSlice.reducer
