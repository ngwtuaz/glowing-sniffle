import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Grid, Typography } from '@mui/material';
import { fetchBudgets, setBudget } from '../../redux/slices/budgetSlice'; // Giả sử bạn đã tạo budgetSlice.js

const BudgetSetting = () => {
    const dispatch = useDispatch();
    const budgets = useSelector((state) => state.budgets.items);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        dispatch(fetchBudgets()); // Lấy danh sách ngân sách hiện tại
    }, [dispatch]);

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmit = () => {
        if (category && amount) {
            dispatch(setBudget({ category, amount }));
            setCategory('');
            setAmount('');
        }
    };

    return (
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Typography variant="h5">Cài Đặt Ngân Sách Hàng Tháng</Typography>
            </Grid>
            <Grid item>
                <TextField
                    label="Danh Mục"
                    value={category}
                    onChange={handleCategoryChange}
                    fullWidth
                    select
                >
                    <MenuItem value="Thực phẩm">Thực phẩm</MenuItem>
                    <MenuItem value="Giải trí">Giải trí</MenuItem>
                    <MenuItem value="Giáo dục">Giáo dục</MenuItem>
                    {/* Thêm các danh mục khác nếu cần */}
                </TextField>
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
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Lưu Ngân Sách
                </Button>
            </Grid>
        </Grid>
    );
};

export default BudgetSetting;