const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.monthlyForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

};

exports.monthlyForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }


};