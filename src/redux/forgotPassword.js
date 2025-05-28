import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

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
  async ({ password, confirmPassword }, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axiosInstance.post(
        `/auth/reset-password/${refreshToken}`,
        { password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      console.log(error, "Error");
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);
