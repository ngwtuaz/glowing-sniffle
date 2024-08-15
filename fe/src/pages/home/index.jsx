import { Container, Box, Typography } from '@mui/material';
// import BudgetSetting from '../../components/budgetExpense';
// import RecurringExpenseForm from '../../components/recurringExpense';

function Home() {
  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
          HOME
        </Typography>
        {/* <BudgetSetting />
        <RecurringExpenseForm /> */}
      </Box>
    </Container>
  );
}

export default Home;
