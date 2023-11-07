import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectAccessToken } from "./authSlice";
import axios from "axios";

const BASE_URL = "http://localhost:3500";

const httpCommon = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

httpCommon.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("vldavy_authToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchUsers = createAsyncThunk("user/fetchUser", async () => {
  try {
    const { data } = await httpCommon.get(`${BASE_URL}/users`);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
  }
});

export const addUser = createAsyncThunk(
  "user/addUser",
  async (createdUser, { rejectWithValue }) => {
    try {
      const { data } = await httpCommon.post(`${BASE_URL}/users`, createdUser);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const { data } = await httpCommon.patch(`${BASE_URL}/users`, updatedUser);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const responce = await httpCommon.delete(`${BASE_URL}/users`, id);
      if (responce?.status === 200) return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

const initialState = usersAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleRequest = (state) => {
      state.status = "loading";
      state.error = null;
    };

    const handleSuccess = (state, action, adapterMethod) => {
      state.status = "succeeded";
      adapterMethod(state, action.payload);
    };

    const handleFailure = (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    };

    builder
      .addCase(fetchUsers.pending, handleRequest)
      .addCase(deleteUser.pending, handleRequest)
      .addCase(addUser.pending, handleRequest)
      .addCase(updateUser.rejected, handleFailure)
      .addCase(fetchUsers.rejected, handleFailure)
      .addCase(addUser.rejected, handleFailure)
      .addCase(updateUser.fulfilled, (state, action) =>
        handleSuccess(state, action, usersAdapter.upsertOne)
      )
      .addCase(fetchUsers.fulfilled, (state, action) =>
        handleSuccess(state, action, usersAdapter.upsertMany)
      )
      .addCase(deleteUser.fulfilled, (state, action) =>
        handleSuccess(state, action, usersAdapter.removeOne)
      )
      .addCase(addUser.fulfilled, (state, action) =>
        handleSuccess(state, action, usersAdapter.addOne)
      );
  },
});

export const { selectAll: selectAllUsers } = usersAdapter.getSelectors(
  (state) => state.user
);

export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;

export const usersSlice = userSlice.reducer;
