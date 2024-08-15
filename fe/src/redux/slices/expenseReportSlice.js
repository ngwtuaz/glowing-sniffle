import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMonthlyReport = createAsyncThunk('report/fetchMonthlyReport', async (token) => {
    const response = await axios.get('http://localhost:3000/report/monthly', {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

const expenseReportSlice = createSlice({
    name: 'report',
    initialState: {
        data: {},
        error: null,
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthlyReport.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchMonthlyReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default expenseReportSlice.reducer;
