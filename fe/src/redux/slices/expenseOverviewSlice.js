import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOverviewData = createAsyncThunk('overview/fetchOverviewData', async (token) => {
    const response = await axios.get('http://localhost:3000/overview', {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

const expenseOverviewSlice = createSlice({
    name: 'overview',
    initialState: {
        data: null,
        error: null,
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverviewData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOverviewData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchOverviewData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default expenseOverviewSlice.reducer;
