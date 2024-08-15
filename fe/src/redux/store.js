import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice.js';
import expenseOverviewSlice from './slices/expenseOverviewSlice.js';
import expenseReportSlice from './slices/expenseReportSlice.js';
import expenseSlice from './slices/expenseSlice.js';
import expenseManagementSlice from './slices/admins/expenseManagementSlice.js';
import userManagementSlice from './slices/admins/userManagementSlice.js';

const store = configureStore({
    reducer: {
        auth: authSlice,
        overview: expenseOverviewSlice,
        report: expenseReportSlice,
        expenses: expenseSlice,
        adminExpenses: expenseManagementSlice,
        adminUsers: userManagementSlice,
    },
});

export default store;
