const db = require('../config/db');
const { validationResult } = require('express-validator');

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-URL-safe characters
        .substring(0, length); // Ensure the string is of the desired length
}

exports.getMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    const [divisi] = await db.execute('SELECT * FROM divisi WHERE divisi.Nama_Divisi LIKE ?', [`%${user.divisi}%`])

    const [forecast] = await db.execute(
        'SELECT * FROM actual_pengeluaran WHERE idActualPengeluaran LIKE ?', 
        [`${divisi[0].idDivisi}%`]
    );

    res.status(200).send({
        error: false,
        message: 'success',
        data: forecast
        // forecast_pengeluaran: forecast
    });
};

exports.itemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    const {idActualPengeluaran, idKategori, Nama_Item, Harga} = req.body;
    const idItem = 'IR-' + generateRandomString(8);

    await db.execute('INSERT INTO request_item_actual_pengeluaran (idItem, idActualPengeluaran, idUser, idKategori, Nama_Item, Harga) VALUES (?,?,?,?,?)',
        [idItem, user.id, idActualPengeluaran, idKategori, Nama_Item, Harga]
    );
    
    // await db.execute('UPDATE actual_pengeluaran fp JOIN (SELECT idActualPengeluaran, SUM(harga) AS total_harga FROM item_actual_pengeluaran GROUP BY idActualPengeluaran) kfp ON fp.idActualPengeluaran = kfp.idActualPengeluaran SET fp.Total_Actual_Pengeluaran = kfp.total_harga WHERE fp.idActualPengeluaran = kfp.idActualPengeluaran;')

    res.status(200).send({
        error: false,
        message: 'item registered successfully.',
        item:{
            idKategori: idItem,
            idForecastPemasukan: idActualPengeluaran,
            idKategori: idKategori,
            Nama_Item: Nama_Item,
            Harga: Harga,
        }
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

exports.getRequestItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const user = req.user;
    const {aid} = req.params;
    const [item] = await db.execute('SELECT * FROM request_item_actual_pengeluaran WHERE idActualPengeluaran = ? AND idUser = ?'
        , [aid, user.id]);

    res.status(200).send({
        error: false,
        message: 'success',
        data: item
    });
};

exports.updateRequestItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;
    const {idKategori, Nama_Item, Harga} = req.body;

    const status = await db.execute('SELECT isApproved FROM request_item_actual_pengeluaran WHERE idRequest_Item = ?', [iid]);
    if(status !== "waiting"){
        return res.status(400).send({ message: 'You can not edit this item.'});
    }

    await db.execute('UPDATE request_item_actual_pengeluaran SET idKategori = ?, Nama_Item = ?, Harga = ? WHERE idRequest_Item = ?',
        [idKategori, Nama_Item, Harga, iid]
    );

    res.status(200).send({
        error: false,
        message: 'success',
        data: iid,
    });
};

exports.deleteRequestItemMonthlyActualOutcome = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }

    const {iid} = req.params;

    const status = await db.execute('SELECT isApproved FROM request_item_actual_pengeluaran WHERE idRequest_Item = ?', [iid]);
    if(status !== "waiting"){
        return res.status(400).send({ message: 'You can not delete this item.'});
    }

    await db.execute('DELETE FROM request_item_actual_pengeluaran WHERE idRequest_Item = ?', [iid]);

    res.status(200).send({
        error: false,
        message: 'success',
    });
};