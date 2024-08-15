import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, MenuItem, Grid, Typography } from '@mui/material';
import { addRecurringExpense } from '../../redux/slices/expenseSlice'; // Giả sử bạn đã cập nhật expenseSlice.js

const RecurringExpenseForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleSubmit = () => {
        if (title && amount && category && startDate) {
            dispatch(addRecurringExpense({ title, amount, category, startDate, endDate }));
            setTitle('');
            setAmount('');
            setCategory('');
            setStartDate('');
            setEndDate('');
        }
    };

    return (
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Typography variant="h5">Thêm Chi Phí Thường Xuyên</Typography>
            </Grid>
            <Grid item>
                <TextField
                    label="Tiêu Đề"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Số Tiền"
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth
                    type="number"
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Danh Mục"
                    value={category}
                    onChange={handleCategoryChange}
                    fullWidth
                    select
                >
                    <MenuItem value="Tiền thuê nhà">Tiền thuê nhà</MenuItem>
                    <MenuItem value="Hóa đơn điện">Hóa đơn điện</MenuItem>
                    {/* Thêm các danh mục khác nếu cần */}
                </TextField>
            </Grid>
            <Grid item>
                <TextField
                    label="Ngày Bắt Đầu"
                    value={startDate}
                    onChange={handleStartDateChange}
                    fullWidth
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Ngày Kết Thúc"
                    value={endDate}
                    onChange={handleEndDateChange}
                    fullWidth
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Lưu Chi Phí
                </Button>
            </Grid>
        </Grid>
    );
};

export default RecurringExpenseForm;
