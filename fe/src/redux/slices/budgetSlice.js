// budgetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Lấy dữ liệu ngân sách từ server
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (token) => {
    const response = await axios.get('http://localhost:3000/budgets', {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

// Cập nhật hoặc tạo mới ngân sách cho một danh mục
export const setBudget = createAsyncThunk('budgets/setBudget', async ({ category, amount, token }) => {
    const response = await axios.post('http://localhost:3000/budgets', { category, amount }, {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

const budgetSlice = createSlice({
    name: 'budgets',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(setBudget.fulfilled, (state, action) => {
                const index = state.items.findIndex(budget => budget.category === action.payload.category);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            });
    }
});

export default budgetSlice.reducer;
