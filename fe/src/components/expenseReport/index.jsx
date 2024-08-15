import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { fetchMonthlyReport } from '../../redux/slices/expenseReportSlice';

const ExpenseReport = () => {
  const dispatch = useDispatch();
  const { data: categorySummary, error, status } = useSelector(state => state.report);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchMonthlyReport(token));
    } else {
      setErrorMessage('You must be logged in to view spending reports.');
    }
  }, [dispatch]);

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  const data = Object.keys(categorySummary).map(category => ({
    name: category,
    value: categorySummary[category]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF7F50'];

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>Monthly Expenditure Report</Typography>
      <Paper sx={{ padding: 2 }}>
        <PieChart width={800} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Paper>
    </Container>
  );
};

export default ExpenseReport;
