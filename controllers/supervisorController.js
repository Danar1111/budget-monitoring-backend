const db = require('../config/db');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

exports.monthlyForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

};

exports.monthlyCategoryForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const [user] = await db.execute('SELECT * FROM users WHERE users.idUser = ?', [user_id])
    if(user && user.role !== "supervisor"){
        return res.status(403).json({ error: 'true', message: 'You do not have the necessary permissions to perform this action.'});
    }

    const [idForecastPemasukan, Nama_Kategori, Harga] = req.body;
    const idKategori = 'CR-' + crypto.randomBytes(8).toString('base64');

    await db.execute('INSERT INTO kategori_forecast_pemasukan (idKategori, idForecastPemasukan, Nama_Kategori, Harga) VALUES (?,?,?,?)'
        [idKategori, idForecastPemasukan, Nama_Kategori, Harga]
    )
    
    res.status(200).send({
        error: false,
        message: 'category registered successfully.',
        user:{
            idKategori: idKategori,
            idForecastPemasukan: idForecastPemasukan,
            Nama_Kategori: Nama_Kategori,
            Harga: Harga,
        }
    });
};
exports.monthlyForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }


};

exports.monthlyCategoryForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const [user] = await db.execute('SELECT * FROM users WHERE users.idUser = ?', [user_id])
    if(user && user.role !== "supervisor"){
        return res.status(403).json({ error: 'true', message: 'You do not have the necessary permissions to perform this action.'});
    }

    const [idForecastPengeluaran, Nama_Kategori, Harga] = req.body;
    const idKategori = 'CE-' + crypto.randomBytes(8).toString('base64');

    await db.execute('INSERT INTO kategori_forecast_pengeluaran (idKategori, idForecastPengeluaran, Nama_Kategori, Harga) VALUES (?,?,?,?)'
        [idKategori, idForecastPengeluaran, Nama_Kategori, Harga]
    )
    
    res.status(200).send({
        error: false,
        message: 'category registered successfully.',
        user:{
            idKategori: idKategori,
            idForecastPemasukan: idForecastPengeluaran,
            Nama_Kategori: Nama_Kategori,
            Harga: Harga,
        }
    });
};