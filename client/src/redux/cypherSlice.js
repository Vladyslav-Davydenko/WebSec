import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
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

export const fetchCyphers = createAsyncThunk(
  "cypher/fetchCypher",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await httpCommon.get(`${BASE_URL}/cyphers`);
      return data;
    } catch (error) {
      return rejectWithValue("Connection to your db is refused");
    }
  }
);

export const addCypher = createAsyncThunk(
  "cypher/addCypher",
  async (createdCypher, { rejectWithValue }) => {
    try {
      const { data } = await httpCommon.post(
        `${BASE_URL}/cyphers`,
        createdCypher
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCypher = createAsyncThunk(
  "cypher/updateCypher",
  async (updatedCypher, { rejectWithValue }) => {
    try {
      const { data } = await httpCommon.patch(
        `${BASE_URL}/cyphers`,
        updatedCypher
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCypher = createAsyncThunk(
  "cypher/deleteCypher",
  async (id, { rejectWithValue }) => {
    try {
      const responce = await httpCommon.delete(`${BASE_URL}/cyphers`, id);
      if (responce?.status === 200) return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cyphersAdapter = createEntityAdapter({
  selectId: (cypher) => cypher._id,
});

const initialState = cyphersAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

const cypherSlice = createSlice({
  name: "cypher",
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
      .addCase(fetchCyphers.pending, handleRequest)
      .addCase(deleteCypher.pending, handleRequest)
      .addCase(addCypher.pending, handleRequest)
      .addCase(updateCypher.rejected, handleFailure)
      .addCase(fetchCyphers.rejected, handleFailure)
      .addCase(addCypher.rejected, handleFailure)
      .addCase(updateCypher.fulfilled, (state, action) =>
        handleSuccess(state, action, cyphersAdapter.upsertOne)
      )
      .addCase(fetchCyphers.fulfilled, (state, action) =>
        handleSuccess(state, action, cyphersAdapter.upsertMany)
      )
      .addCase(deleteCypher.fulfilled, (state, action) =>
        handleSuccess(state, action, cyphersAdapter.removeOne)
      )
      .addCase(addCypher.fulfilled, (state, action) =>
        handleSuccess(state, action, cyphersAdapter.addOne)
      );
  },
});

export const { selectAll: selectAllCyphers } = cyphersAdapter.getSelectors(
  (state) => state.cypher
);

export const selectCypherStatus = (state) => state.cypher.status;
export const selectCypherError = (state) => state.cypher.error;

export const cyphersSlice = cypherSlice.reducer;
