// ** Redux Imports
// import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
// import useJwt from '@src/auth/jwt/useJwt'

// const config = useJwt.jwtConfig

// const initialUser = () => {
//   const item = window.localStorage.getItem('userData')
//   //** Parse stored json or if none return initialValue
//   return item ? JSON.parse(item) : {}
// }

// export const authSlice = createSlice({
//   name: 'authentication',
//   initialState: {
//     userData: initialUser()
//   },
//   reducers: {
//     handleLogin: (state, action) => {
//       state.userData = action.payload
//       state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
//       state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
//       localStorage.setItem('userData', JSON.stringify(action.payload))
//       localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.accessToken))
//       localStorage.setItem(config.storageRefreshTokenKeyName, JSON.stringify(action.payload.refreshToken))
//     },
//     handleLogout: state => {
//       state.userData = {}
//       state[config.storageTokenKeyName] = null
//       state[config.storageRefreshTokenKeyName] = null
//       // ** Remove user, accessToken & refreshToken from localStorage
//       localStorage.removeItem('userData')
//       localStorage.removeItem(config.storageTokenKeyName)
//       localStorage.removeItem(config.storageRefreshTokenKeyName)
//     }
//   }
// })

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// --------------------
// Axios Instance
// --------------------
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

const initialState = {
  data: null,
  isLoading: false,
  error: null
}

// --------------------
// Async Thunk for Fetching User Data
// --------------------
export const fetchUserData = createAsyncThunk(
  'authentication/fetchUserData',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/register', payload)
      return response.data
    } catch (error) {
      console.error('Error fetching User Data:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchsingUserData = createAsyncThunk(
  'authentication/fetchsingUserData',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`auth/login`, payload)
      return response.data
    } catch (error) {
      console.error('Error fetching Single User Data:', error)
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

// --------------------
// Exports
// --------------------
export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer