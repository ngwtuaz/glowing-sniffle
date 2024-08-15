import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';
import Home from './pages/home';
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import CreateExpense from './components/expenses/createEx';
import ExpenseList from './components/expenses/expenseList';
import ExpenseOverview from './components/expenseOverview';
import ExpenseReport from './components/expenseReport';
import Header from './components/layouts/header';
import UserManagement from './components/admin/list-user';
import ExpenseManagement from './components/admin/expense-user';

// function checkLogin() {
//   let token = localStorage.getItem('token');
//   if(token){
//     return redirect('/')
//   } else {
//     return null;
//   }
// }

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
        <Header />
        <main style={{ flexGrow: 1, padding: '1rem', marginTop: '64px' }}> 
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/expense-list' element={<ExpenseList />} />
            <Route path='/expense-create' element={<CreateExpense />} />
            <Route path='/expenses' element={<ExpenseOverview />} />
            <Route path='/expense-report' element={<ExpenseReport />} />
            <Route path='admin/users' element={<UserManagement />} /> 
            <Route path='admin/expenses' element={<ExpenseManagement />} />
          </Routes>
        </main>
      </div>
    
    </Router>
  );
}

export default App;
