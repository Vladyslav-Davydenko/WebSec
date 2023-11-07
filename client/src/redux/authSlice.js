import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = "http://localhost:3500";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth`, credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: localStorage.getItem("vldavy_user")
    ? JSON.parse(localStorage.getItem("vldavy_user"))
    : null,
  accessToken: localStorage.getItem("vldavy_authToken") ?? null,
  isAuthenticated: localStorage.getItem("vldavy_authToken") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.setItem("vldavy_user", "");
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      localStorage.setItem("vldavy_authToken", "");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const { accessToken } = action.payload;
      if (accessToken) {
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        const decoded = jwtDecode(accessToken);
        if (decoded?.UserInfo) {
          state.user = decoded.UserInfo;
          localStorage.setItem("vldavy_user", JSON.stringify(decoded.UserInfo));
        }
        localStorage.setItem("vldavy_authToken", accessToken);
      }
    });
  },
});

export const { setUser, setAccessToken, clearUser, clearAccessToken } =
  authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
