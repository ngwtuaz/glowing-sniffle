import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Box, Typography } from '@mui/material';
import { addExpense } from '../../../redux/slices/expenseSlice';

function CreateExpense() {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must log in before adding expenses');
      setSuccess('');
      return;
    }

    const expense = { description, date, amount, category };

    try {
      await dispatch(addExpense({ expense, token })).unwrap();
      setSuccess('Expenses were added successfully');
      setError('');
      setDescription('');
      setDate('');
      setAmount('');
      setCategory('');
    } catch (error) {
      setError('Additional failure expense');
      setSuccess('');
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>Add Expense</Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="category"
            required
          >
            <MenuItem value="">
              <em>Select category</em>
            </MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Vehicles">Vehicles</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          label="Amount of money"
          type="number"
          fullWidth
          variant="outlined"
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          variant="outlined"
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />


        <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#d5ad48', '&:hover': { bgcolor: '#95672a' } }}>
          Add expense
        </Button>
      </Box>
    </Container>
  );
}

export default CreateExpense;
