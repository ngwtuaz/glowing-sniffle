import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (token) => {
  const response = await axios.get('http://localhost:3000/admin/users', {
    headers: { 'x-access-token': token }
  });
  return response.data;
});

const userManagementSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [],
    error: '',
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Unable to load user list';
      });
  },
});

const selectUsersState = (state) => state.adminUsers || { users: [], error: '', status: 'idle' };

export const selectUsers = createSelector(
  [selectUsersState],
  (state) => state.users 
);

export const selectError = createSelector(
  [selectUsersState],
  (state) => state.error 
);

export const selectStatus = createSelector(
  [selectUsersState],
  (state) => state.status 
);

export default userManagementSlice.reducer;
