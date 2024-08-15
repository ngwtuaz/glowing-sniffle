// expenseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (token) => {
    const response = await axios.get('http://localhost:3000/expenses', {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

export const addExpense = createAsyncThunk('expenses/addExpense', async ({ expense, token }) => {
    const response = await axios.post('http://localhost:3000/expenses', expense, {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

export const updateExpense = createAsyncThunk('expenses/updateExpense', async ({ id, updates, token }) => {
    const response = await axios.put(`http://localhost:3000/expenses/${id}`, updates, {
        headers: { 'x-access-token': token }
    });
    return response.data;
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async ({ id, token }) => {
    await axios.delete(`http://localhost:3000/expenses/${id}`, {
        headers: { 'x-access-token': token }
    });
    return id;
});

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: {
        items: [],
        selectedExpense: null,
        error: null,
        status: 'idle',
        filter: ''
    },
    reducers: {
        selectExpense: (state, action) => {
            state.selectedExpense = action.payload;
        },
        clearSelectedExpense: (state) => {
            state.selectedExpense = null;
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex(exp => exp.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter(exp => exp.id !== action.payload);
            });
    }
});

export const { selectExpense, clearSelectedExpense, setFilter } = expenseSlice.actions;

export default expenseSlice.reducer;
