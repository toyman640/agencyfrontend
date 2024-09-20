import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const logInUserUrl = 'http://127.0.0.1:8000/backend/login/';
const logOutUrl = 'http://127.0.0.1:8000/backend/logout/';
const createAgentUser = 'http://127.0.0.1:8000/backend/register/';

const persistedUserInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
  user: persistedUserInfo,
  loading: false,
  agentUser: null,
  error: null,
};

export const signUpAgent = createAsyncThunk('user/signUpAgent', async (newAgent) => {
  try {
    const response = await axios.post(createAgentUser, newAgent);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const logInUser = createAsyncThunk('user/logInUser', async (userInfo) => {
  try {
    const response = await axios.post(logInUserUrl, userInfo);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const logOutUser = createAsyncThunk('user/logOutUser', async (_, { getState }) => {
  const { user: { user: { token } } } = getState();
  try {
    await axios.post(logOutUrl, {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    localStorage.removeItem('userInfo');
    return null;
  } catch (err) {
    return err.message;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(logInUser.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(logInUser.fulfilled, (state, action) => {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        return {
          ...state,
          user: action.payload,
          loading: false,
          error: null,
        };
      })
      .addCase(logInUser.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(logOutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signUpAgent.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(signUpAgent.fulfilled, (state, action) => ({
        ...state,
        agentUser: action.payload,
        loading: false,
        error: null,
      }))
      .addCase(signUpAgent.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },
});

export default userSlice.reducer;
