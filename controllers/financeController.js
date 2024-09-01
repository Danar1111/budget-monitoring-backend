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

exports.monthlyActualIncome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const [income] = await db.execute('SELECT * FROM actual_pemasukan');

    res.status(200).send({
        error: false,
        message: 'success',
        data: income,
    })
};

exports.itemMonthlyActualIncome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    if(user && user.role !== "supervisor"){
        return res.status(403).json({ error: 'true', message: 'You do not have the necessary permissions to perform this action.'});
    }

    const {idActualPemasukan, idKategori, Nama_Item, Harga} = req.body;
    const idItem = 'IR-' + generateRandomString(8);

    await db.execute('INSERT INTO item_actual_pemasukan (idItem, idActualPemasukan, idUser, idKategori, Nama_Item, Harga) VALUES (?,?,?,?,?,?)',
        [idItem, idActualPemasukan, user.id, idKategori, Nama_Item, Harga]
    );
    
    await db.execute('UPDATE actual_pemasukan fp JOIN (SELECT idActualPemasukan, SUM(harga) AS total_harga FROM item_actual_pemasukan GROUP BY idActualPemasukan) kfp ON fp.idActualPemasukan = kfp.idActualPemasukan SET fp.Total_Actual_Pemasukan = kfp.total_harga WHERE fp.idActualPemasukan = kfp.idActualPemasukan;')

    res.status(200).send({
        error: false,
        message: 'item registered successfully.',
        item:{
            idKategori: idItem,
            idForecastPemasukan: idActualPemasukan,
            idKategori: idKategori,
            Nama_Item: Nama_Item,
            Harga: Harga,
        }
    });
};

exports.getItemMonthlyActualIncome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {aid} = req.params;

    const [item] = await db.execute('SELECT * FROM item_actual_pemasukan WHERE idActualPemasukan = ?', [aid]);

    res.status(200).send({
        error: false,
        message: 'success',
        data: item
    });
};

exports.updateItemMonthlyActualIncome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;
    const {idKategori, Nama_Item, Harga} = req.body;

    await db.execute('UPDATE item_actual_pemasukan SET idKategori = ?, Nama_Item = ?, Harga = ? WHERE idItem = ?',
        [idKategori, Nama_Item, Harga, iid]
    );

    await db.execute('UPDATE actual_pemasukan fp JOIN (SELECT idActualPemasukan, SUM(harga) AS total_harga FROM item_actual_pemasukan GROUP BY idActualPemasukan) kfp ON fp.idActualPemasukan = kfp.idActualPemasukan SET fp.Total_Actual_Pemasukan = kfp.total_harga WHERE fp.idActualPemasukan = kfp.idActualPemasukan;')

    res.status(200).send({
        error: false,
        message: 'success',
        data: iid,
    });
};

exports.deleteItemMonthlyActualIncome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;
    await db.execute('DELETE FROM item_actual_pemasukan WHERE idItem = ?', [iid]);

    await db.execute('UPDATE actual_pemasukan fp JOIN (SELECT idActualPemasukan, SUM(harga) AS total_harga FROM item_actual_pemasukan GROUP BY idActualPemasukan) kfp ON fp.idActualPemasukan = kfp.idActualPemasukan SET fp.Total_Actual_Pemasukan = kfp.total_harga WHERE fp.idActualPemasukan = kfp.idActualPemasukan;')

    res.status(200).send({
        error: false,
        message: 'success',
    });
};

exports.getItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {aid} = req.params;
    const [item] = await db.execute('SELECT * FROM item_actual_pengeluaran WHERE idActualPengeluaran = ?', [aid]);

    res.status(200).send({
        error: false,
        message: 'success',
        data: item
    });
};

exports.monthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const outcome = await db.execute('SELECT * FROM actual_pengeluaran');

    res.status(200).send({
        error: false,
        message: 'success',
        data: outcome,
    })
};

exports.updateItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;
    const {idKategori, Nama_Item, Harga} = req.body;

    await db.execute('UPDATE item_actual_pengeluaran SET idKategori = ?, Nama_Item = ?, Harga = ? WHERE idItem = ?',
        [idKategori, Nama_Item, Harga, iid]
    );

    await db.execute('UPDATE actual_pengeluaran fp JOIN (SELECT idActualPengeluaran, SUM(harga) AS total_harga FROM item_actual_pengeluaran GROUP BY idActualPengeluaran) kfp ON fp.idActualPengeluaran = kfp.idActualPengeluaran SET fp.Total_Actual_Pengeluaran = kfp.total_harga WHERE fp.idActualPengeluaran = kfp.idActualPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'success',
        data: iid,
    });
};

exports.deleteItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;

    await db.execute('DELETE FROM item_actual_pengeluaran WHERE idItem = ?', [iid]);

    await db.execute('UPDATE actual_pengeluaran fp JOIN (SELECT idActualPengeluaran, SUM(harga) AS total_harga FROM item_actual_pengeluaran GROUP BY idActualPengeluaran) kfp ON fp.idActualPengeluaran = kfp.idActualPengeluaran SET fp.Total_Actual_Pengeluaran = kfp.total_harga WHERE fp.idActualPengeluaran = kfp.idActualPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'success',
    });
};
