const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
const port = 3000;

const secretKey = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send('No token provided');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token');
        }
        req.user = decoded;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

const readDatabase = () => {
    const data = fs.readFileSync('database.json');
    return JSON.parse(data);
};

const writeDatabase = (data) => {
    fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
};

// sign up
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const database = readDatabase();

    if (database.users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const role = email === 'tuanadmin@gmail.com' ? 'admin' : 'user';

    database.users.push({ username, email, password: hashedPassword, role });

    writeDatabase(database);
    res.status(201).json({ message: 'Register successfully!' });
});


// sign in
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const database = readDatabase();
    const user = database.users.find(user => user.email === email);

    if (!user) {
        return res.status(400).send('Email or password is invalid');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Email or password is invalid');
    }

    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
        expiresIn: 86400 
    });

    res.status(200).send({ auth: true, token });
});

// logout
app.post('/logout', authenticateToken, (req, res) => {
    res.status(200).send('Signed out successfully');
});

// Add expense
app.post('/expenses', authenticateToken, (req, res) => {
    const { description, date, amount, category } = req.body;

    const database = readDatabase();
    const newExpense = {
        id: new Date().getTime().toString(), 
        description,
        date,
        amount,
        category,
        user: req.user.email
    };
    database.expenses.push(newExpense);

    writeDatabase(database);
    res.status(201).send('Add success expense');
});

// getall data user expense
app.get('/expenses', authenticateToken, (req, res) => {
    const database = readDatabase();
    const userExpenses = database.expenses.filter(expense => expense.user === req.user.email);
    res.status(200).send(userExpenses);
});

// get expense by id
app.get('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const database = readDatabase();
    const expense = database.expenses.find(exp => exp.id === id && exp.user === req.user.email);

    if (!expense) {
        return res.status(404).send('Error');
    }

    res.status(200).send(expense);
});

// update expense
app.put('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { description, date, amount, category } = req.body;

    const database = readDatabase();
    const expenseIndex = database.expenses.findIndex(expense => expense.id === id && expense.user === req.user.email);

    if (expenseIndex === -1) {
        return res.status(404).send('Error');
    }

    database.expenses[expenseIndex] = { ...database.expenses[expenseIndex], description, date, amount, category };
    writeDatabase(database);
    res.status(200).send('Successfully updated expense');
});

// del expense
app.delete('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const database = readDatabase();
    const expenseIndex = database.expenses.findIndex(expense => expense.id === id && expense.user === req.user.email);

    if (expenseIndex === -1) {
        return res.status(404).send('Lỗi');
    }

    database.expenses.splice(expenseIndex, 1);
    writeDatabase(database);
    res.status(200).send('Expense deleted successfully');
});

//expense overview
app.get('/overview', authenticateToken, (req, res) => {
    const database = readDatabase();
    const userExpenses = database.expenses.filter(expense => expense.user === req.user.email);

    const totalSpending = userExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

    const categorySummary = userExpenses.reduce((summary, expense) => {
        if (!summary[expense.category]) {
            summary[expense.category] = { spending: 0 };
        }
        summary[expense.category].spending += parseFloat(expense.amount);
        return summary;
    }, {});

    res.status(200).send({
        totalSpending,
        categorySummary,
        userExpenses,
    });
});



// expense report
app.get('/report/monthly', authenticateToken, (req, res) => {
    const database = readDatabase();
    const userExpenses = database.expenses.filter(expense => expense.user === req.user.email);

    const categorySummary = userExpenses.reduce((summary, expense) => {
        if (!summary[expense.category]) {
            summary[expense.category] = 0;
        }
        summary[expense.category] += parseFloat(expense.amount);
        return summary;
    }, {});

    res.status(200).send(categorySummary);
});

// user management
app.get('/admin/users', authenticateToken, authorizeAdmin, (req, res) => {
    const database = readDatabase();
    res.status(200).send(database.users);
});

// user spending management
app.get('/admin/expenses', authenticateToken, authorizeAdmin, (req, res) => {
    const database = readDatabase();
    res.status(200).send(database.expenses);
});

app.get('/admin/expenses/:userEmail', authenticateToken, authorizeAdmin, (req, res) => {
    const { userEmail } = req.params;

    const database = readDatabase();
    const userExpenses = database.expenses.filter(expense => expense.user === userEmail);

    res.status(200).send(userExpenses);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
