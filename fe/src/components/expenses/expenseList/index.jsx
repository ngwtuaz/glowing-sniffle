// ExpenseList.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Paper, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchExpenses, selectExpense, clearSelectedExpense, updateExpense, deleteExpense, setFilter } from '../../../redux/slices/expenseSlice';

function ExpenseList() {
  const dispatch = useDispatch();
  const { items: expenses, selectedExpense, error, status, filter } = useSelector(state => state.expenses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchExpensesData = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchExpenses(token));
    } else {
      setErrorMessage('You must log in to view the expense list!');
    }
  };

  const handleOpenDialog = (expense, actionType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be logged in to perform this action!');
      return;
    }

    dispatch(selectExpense(expense));
    setCategory(expense.category);
    setDescription(expense.description);
    setDate(expense.date);
    setAmount(expense.amount);
    setAction(actionType);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDescription('');
    setDate('');
    setAmount('');
    setAction('');
    dispatch(clearSelectedExpense());
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('You must be logged in to perform this action!');
      return;
    }

    if (action === 'edit' && selectedExpense) {
      try {
        await dispatch(updateExpense({ id: selectedExpense.id, updates: { category, description, date, amount }, token })).unwrap();
        fetchExpensesData();
        handleCloseDialog();
      } catch (error) {
        setErrorMessage('Expense update failed');
      }
    } else if (action === 'delete' && selectedExpense) {
      try {
        await dispatch(deleteExpense({ id: selectedExpense.id, token })).unwrap();
        fetchExpensesData();
        handleCloseDialog();
      } catch (error) {
        setErrorMessage('Expense delete failed');
      }
    } else {
      setErrorMessage('No expense has been selected');
    }
  };

  const handleFilterChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  useEffect(() => {
    fetchExpensesData();
  }, [dispatch]);

  const filteredExpenses = expenses.filter(expense => expense.category.toLowerCase().includes(filter.toLowerCase()));

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>Expense List</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <TextField
        label="Filter by category"
        variant="outlined"
        fullWidth
        value={filter}
        onChange={handleFilterChange}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Descriptions</TableCell>
              <TableCell>Amount of money</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(expense, 'edit')}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(expense, 'delete')}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{action === 'edit' ? 'Update' : 'Delete'}</DialogTitle>
        <DialogContent>
          {action === 'edit' && (
            <>
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
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
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                label="Amount of money"
                type="number"
                fullWidth
                variant="outlined"
                margin="normal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
              />
            </>
          )}
          {action === 'delete' && <Typography>Are you sure you want to delete this expense?</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="secondary">{action === 'edit' ? 'Update' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExpenseList;
