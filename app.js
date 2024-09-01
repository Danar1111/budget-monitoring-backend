const express = require('express');
const app = express();
const routes= require('./routes/route');
const db = require('./config/db'); 
require('dotenv').config();
const cronJob = require('./controllers/systemController');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(routes);
// cronJob.createNewMonthlyBudget();
// cronJob.createNewMonthlyBudgetActual();
// cronJob.emailMonthlyBudget();
// cronJob.emailReminder();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    db.execute('SELECT 1').then(() => {
        console.log('Database connection successfully');
    }).catch((err) => {
        console.error('Database connection failed:', err);
    });
});