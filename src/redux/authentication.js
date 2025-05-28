import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../auth/axiosInstance'; // Adjust path


const initialState = {
  userData: JSON.parse(localStorage.getItem('userData')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null
}
console.log(initialState)

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
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

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
  }
})


export const { handleLogin, handleLogout } = authSlice.actions
export default authSlice.reducer
