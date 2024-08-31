const db = require('../config/db');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-URL-safe characters
        .substring(0, length); // Ensure the string is of the desired length
}

exports.monthlyForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user_id = req.user.id;
    const {fid} = req.params

    await db.execute('UPDATE forecast_pemasukan SET idUser = ? WHERE idForecastPemasukan = ?', [user_id, fid]);

    res.status(200).send({
        error: false,
        message: 'success',
    });
};

exports.getMonthlyForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    const [divisi] = await db.execute('SELECT * FROM divisi WHERE divisi.Nama_Divisi LIKE ?', [`${user.divisi}`])

    const [forecast] = await db.execute(
        'SELECT * FROM forecast_pemasukan WHERE idForecastPemasukan LIKE ?', 
        [`${divisi[0].idDivisi}%`]
    );

    res.status(200).send({
        error: false,
        message: 'success',
        data: forecast
        // forecast_pengeluaran: forecast
    });
};

exports.monthlyCategoryForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    if(user && user.role !== "supervisor"){
        return res.status(403).json({ error: 'true', message: 'You do not have the necessary permissions to perform this action.'});
    }

    const {idForecastPemasukan, Nama_Kategori, Harga} = req.body;
    const idKategori = 'CR-' + generateRandomString(8);

    await db.execute('INSERT INTO kategori_forecast_pemasukan (idKategori, idForecastPemasukan, Nama_Kategori, Harga) VALUES (?,?,?,?)',
        [idKategori, idForecastPemasukan, Nama_Kategori, Harga]
    );
    
    await db.execute('UPDATE forecast_pemasukan fp JOIN (SELECT idForecastPemasukan, SUM(harga) AS total_harga FROM kategori_forecast_pemasukan GROUP BY idForecastPemasukan) kfp ON fp.idForecastPemasukan = kfp.idForecastPemasukan SET fp.Total_Forecast_Pemasukan = kfp.total_harga WHERE fp.idForecastPemasukan = kfp.idForecastPemasukan;')

    res.status(200).send({
        error: false,
        message: 'category registered successfully.',
        kategori:{
            idKategori: idKategori,
            idForecastPemasukan: idForecastPemasukan,
            Nama_Kategori: Nama_Kategori,
            Harga: Harga,
        }
    });
};

exports.getMonthlyCategoryForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {fid} = req.params;

    const [kategori] = await db.execute('SELECT * FROM kategori_forecast_pemasukan WHERE idForecastPemasukan = ?', [fid]);

    res.status(200).send({
        error: false,
        message: 'success',
        data: kategori
    });
};

exports.updateMonthlyCategoryForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {cid} = req.params;
    const {Nama_Kategori, Harga} = req.body;

    await db.execute('UPDATE kategori_forecast_pemasukan SET Nama_Kategori = ?, Harga = ? WHERE idKategori = ?',
        [Nama_Kategori, Harga, cid]
    );

    await db.execute('UPDATE forecast_pemasukan fp JOIN (SELECT idForecastPemasukan, SUM(harga) AS total_harga FROM kategori_forecast_pemasukan GROUP BY idForecastPemasukan) kfp ON fp.idForecastPemasukan = kfp.idForecastPemasukan SET fp.Total_Forecast_Pemasukan = kfp.total_harga WHERE fp.idForecastPemasukan = kfp.idForecastPemasukan;')

    res.status(200).send({
        error: false,
        message: 'success',
        data: cid
    });
};

exports.deleteMonthlyCategoryForecastIncome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {cid} = req.params;
    await db.execute('DELETE FROM kategori_forecast_pemasukan WHERE idKategori = ?', [cid]);

    await db.execute('UPDATE forecast_pemasukan fp JOIN (SELECT idForecastPemasukan, SUM(harga) AS total_harga FROM kategori_forecast_pemasukan GROUP BY idForecastPemasukan) kfp ON fp.idForecastPemasukan = kfp.idForecastPemasukan SET fp.Total_Forecast_Pemasukan = kfp.total_harga WHERE fp.idForecastPemasukan = kfp.idForecastPemasukan;')

    res.status(200).send({
        error: false,
        message: 'success',
    });
};

exports.monthlyForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user_id = req.user.id;
    const {fid} = req.params

    await db.execute('UPDATE forecast_pengeluaran SET idUser = ? WHERE idForecastPengeluaran = ?', [user_id, fid]);

    res.status(200).send({
        error: false,
        message: 'success',
    });
};

exports.getMonthlyForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    const [divisi] = await db.execute('SELECT * FROM divisi WHERE divisi.Nama_Divisi LIKE ?', [`%${user.divisi}%`])

    const [forecast] = await db.execute(
        'SELECT * FROM forecast_pengeluaran WHERE idForecastPengeluaran LIKE ?', 
        [`${divisi[0].idDivisi}%`]
    );

    res.status(200).send({
        error: false,
        message: 'success',
        data: forecast
        // forecast_pengeluaran: forecast
    });
};

exports.monthlyCategoryForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    if(user && user.role !== "supervisor"){
        return res.status(403).json({ error: 'true', message: 'You do not have the necessary permissions to perform this action.'});
    }

    const {idForecastPengeluaran, Nama_Kategori, Harga} = req.body;
    const idKategori = 'CE-' + generateRandomString(8);

    await db.execute('INSERT INTO kategori_forecast_pengeluaran (idKategori, idForecastPengeluaran, Nama_Kategori, Harga) VALUES (?,?,?,?)',
        [idKategori, idForecastPengeluaran, Nama_Kategori, Harga]
    )
    
    await db.execute('UPDATE forecast_pengeluaran fp JOIN (SELECT idForecastPengeluaran, SUM(harga) AS total_harga FROM kategori_forecast_pengeluaran GROUP BY idForecastPengeluaran) kfp ON fp.idForecastPengeluaran = kfp.idForecastPengeluaran SET fp.Total_Forecast_Pengeluaran = kfp.total_harga WHERE fp.idForecastPengeluaran = kfp.idForecastPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'category registered successfully.',
        kategori:{
            idKategori: idKategori,
            idForecastPemasukan: idForecastPengeluaran,
            Nama_Kategori: Nama_Kategori,
            Harga: Harga,
        }
    });
};

exports.getMonthlyCategoryForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {fid} = req.params;

    const kategori = await db.execute('SELECT * FROM kategori_forecast_pengeluaran WHERE idForecastPengeluaran = ?', [fid]);

    res.status(200).send({
        error: false,
        message: 'success',
        data: kategori
    });
};

exports.updateMonthlyCategoryForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {cid} = req.params;
    const {Nama_Kategori, Harga} = req.body;

    await db.execute('UPDATE kategori_forecast_pengeluaran SET Nama_Kategori = ?, Harga = ? WHERE idKategori = ?',
        [Nama_Kategori, Harga, cid]
    );

    await db.execute('UPDATE forecast_pengeluaran fp JOIN (SELECT idForecastPengeluaran, SUM(harga) AS total_harga FROM kategori_forecast_pengeluaran GROUP BY idForecastPengeluaran) kfp ON fp.idForecastPengeluaran = kfp.idForecastPengeluaran SET fp.Total_Forecast_Pengeluaran = kfp.total_harga WHERE fp.idForecastPengeluaran = kfp.idForecastPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'success',
    });
};

exports.deleteMonthlyCategoryForecastOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {cid} = req.params;
    await db.execute('DELETE FROM kategori_forecast_pengeluaran WHERE idKategori = ?', [cid]);

    await db.execute('UPDATE forecast_pengeluaran fp JOIN (SELECT idForecastPengeluaran, SUM(harga) AS total_harga FROM kategori_forecast_pengeluaran GROUP BY idForecastPengeluaran) kfp ON fp.idForecastPengeluaran = kfp.idForecastPengeluaran SET fp.Total_Forecast_Pengeluaran = kfp.total_harga WHERE fp.idForecastPengeluaran = kfp.idForecastPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'success',
    });
};