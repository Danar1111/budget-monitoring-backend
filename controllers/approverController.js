const db = require('../config/db');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, length);
};

exports.getForecastPemasukan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pemasukan WHERE isApproved = "waiting"');
        
        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};

exports.getAllForecastPemasukan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pemasukan');

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error during fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};

exports.getDetailForecastPemasukan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {id} = req.params;

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pemasukan WHERE idForecastPemasukan = ?', [id]);

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'})
    }
};

exports.getKategoriForecastPemasukan = async (req, res) => {;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {id} = req.params;

    try {
        const [data] = await db.execute('SELECT * FROM kategori_forecast_pemasukan WHERE idForecastPemasukan = ?', [id]);

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'})
    }
};

exports.getForecastPengeluaran = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pengeluaran WHERE isApproved = "waiting"');
        
        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};

exports.getAllForecastPengeluaran = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pengeluaran');
        
        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'})
    }
};

exports.getDetailForecastPengeluaran = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {id} = req.params;

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pengeluaran WHERE idForecastPengeluaran = ?', [id]);
        
        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'})
    }
};


exports.getKategoriForecastPengeluaran = async (req, res) => {;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const {id} = req.params;

    try {
        const [data] = await db.execute('SELECT * FROM kategori_forecast_pengeluaran WHERE idForecastPengeluaran = ?', [id]);

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: true, message: 'Server error'})
    }
};

exports.approveToForecastPemasukan = async (req, res ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { id, status } = req.body;
    let { notes } = req.body;
    if (!notes) {
        notes = 'tidak ada catatan';
    }
    const approvedBy = req.user.id;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    try {
        const [divisi] = await db.execute('SELECT u.idDivisi FROM forecast_pemasukan f LEFT JOIN users u on f.idUser = u.idUser WHERE idForecastPemasukan = ?', [id]);
        await db.execute('UPDATE forecast_pemasukan SET isApproved = ?, timeApproved = NOW(), approvedBy = ?, notes = ? WHERE idForecastPemasukan = ?', [status, approvedBy, notes, id]);

        if (status === 'rejected') {
            let idIn = generateRandomString(5);
            let tableNameIn = divisi[0].idDivisi + '-' + currentMonth + '-' + currentYear + '-in' + '-' + idIn;
            await db.execute('INSERT INTO forecast_pemasukan (idForecastPemasukan, Bulan, Tahun, Total_Forecast_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
        }

        res.status(200).send({
            error: false,
            message: 'Update status success',
        });
    } catch (err) {
        console.error('Error during update:',err);
        res.status(500).send({ error: true, message: 'Server error' })
    }
};

exports.approveToForecastPengeluaran = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { id, status } = req.body;
    let { notes } = req.body;
    if (!notes) {
        notes = 'tidak ada catatan';
    }
    const approvedBy = req.user.id;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    try {
        const [divisi] = await db.execute('SELECT u.idDivisi FROM forecast_pengeluaran f LEFT JOIN users u on f.idUser = u.idUser WHERE idForecastPengeluaran = ?', [id]);
        await db.execute('UPDATE forecast_pengeluaran SET isApproved = ?, timeApproved = NOW(), approvedBy = ?, notes = ? WHERE idForecastPengeluaran = ?', [status, approvedBy, notes, id]);

        if (status === 'rejected') {
            let idIn = generateRandomString(5);
            let tableNameOut = divisi[0].idDivisi + '-' + currentMonth + '-' + currentYear + '-out' + '-' + idIn;
            await db.execute('INSERT INTO forecast_pengeluaran (idForecastPengeluaran, Bulan, Tahun, Total_Forecast_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
        }

        res.status(200).send({
            error: false,
            message: 'Update status success',
        });
    } catch (err) {
        console.error('Error during update:',err);
        res.status(500).send({ error: true, message: 'Server error' })
    }
};

exports.getActualRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    // const currentDate = new Date();
    // const currentMonth = currentDate.getMonth();
    const {aid} = req.params;
    const user_id = req.user.id;

    try {
        const [data] = await db.execute('SELECT r.* FROM request_item_actual_pengeluaran r JOIN users u ON r.idUser = u.idUser WHERE u.Report_to = ? AND idActualPengeluaran = ?', [user_id, aid]);

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:',err);
        res.status(500).send({ error: true, message: 'Server error' })
    }
};

exports.getDetailActualRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    
    const {aid} = req.params;

    try {
        const [data] = await db.execute('SELECT * FROM request_item_actual_pengeluaran WHERE idRequest_Item = ?', [aid]);

        res.status(200).send({
            error: false,
            message: 'Data fetched successfully',
            data: data
        });
    } catch (err) {
        console.error('Error fetching data:',err);
        res.status(500).send({ error: true, message: 'Server error' })
    }
};

exports.approveToActualRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { id, status } = req.body;
    let { notes } = req.body;
    if (!notes) {
        notes = 'tidak ada catatan';
    }
    const approvedBy = req.user.id;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    try {
        if (status === 'approved') {
            await db.execute('UPDATE request_item_actual_pengeluaran SET isApproved = ?, timeApproved = NOW(), approvedBy = ?, notes = ? WHERE idRequest_item = ?',[status, approvedBy, notes, id]);
            const [id_request] = await db.execute('SELECT k.idKategori AS idKategori, k.Harga AS Harga_f, r.Harga AS Harga_a, r.idUser AS idUser, r.Nama_Item AS Nama_Item FROM request_item_actual_pengeluaran r JOIN kategori_forecast_pengeluaran k ON r.idKategori = k.idKategori WHERE idRequest_item = ?', [id]);

            const [divisi] = await db.execute('SELECT Nama, idDivisi from users WHERE idUser = ?',[id_request[0].idUser]);

            const [actual_outcome] = await db.execute('SELECT * FROM actual_pengeluaran WHERE idDivisi = ? AND Bulan = ? AND Tahun = ?', [divisi[0].idDivisi, currentMonth, currentYear]);

            const sisa = id_request[0].Harga_f - id_request[0].Harga_a;
            
            let warn = false
            
            if (sisa < 0) {
                warn = true;
            }
            
            await db.execute('INSERT INTO item_actual_pengeluaran VALUES (?, ?, ?, ?, ?, ?, ?)',[id, actual_outcome[0].idActualPengeluaran, id_request[0].idUser, id_request[0].idKategori, id_request[0].Nama_Item, Number(id_request[0].Harga_a), sisa]);

            const [total_outcome] = await db.execute('SELECT SUM(Harga) as total FROM item_actual_pengeluaran WHERE idActualPengeluaran = ?', [actual_outcome[0].idActualPengeluaran]);

            await db.execute('UPDATE actual_pengeluaran SET Total_Actual_Pengeluaran = ? WHERE idDivisi = ? AND Bulan = ? AND Tahun = ?', [total_outcome[0].total, divisi[0].idDivisi, currentMonth, currentYear]);

            res.status(200).send({
                error: false,
                message: 'Update status success',
                warning: warn,
                testActual: {
                    total_outcome: total_outcome[0].total,
                    divisi: divisi[0].idDivisi,
                    currentMonth,
                    currentYear
                },
                testItem: {
                    id: id,
                    actualId: actual_outcome[0].idActualPengeluaran,
                    idUser: id_request[0].idUser,
                    idKategori: id_request[0].idKategori,
                    NamaItem: id_request[0].Nama_Item,
                    harga: Number(id_request[0].Harga_a),
                    sisa: sisa
                }

            });
        } else if (status === 'rejected') {
            await db.execute('UPDATE request_item_actual_pengeluaran SET isApproved = ?, timeApproved = NOW(), approvedBy = ?, notes = ? WHERE idRequest_item = ?',[status, approvedBy, notes, id]);
            const [data] = await db.execute('SELECT * FROM item_actual_pengeluaran WHERE idItem = ?', [id]);

            if (data.length <= 0) {
                return res.status(200).json({
                    error: false,
                    message: 'Update notes succes',
                })
            }

            if (data.length > 0) {
                await db.execute('DELETE FROM item_actual_pengeluaran WHERE idItem = ?', [id]);

                let [count] = await db.execute('SELECT SUM(Harga) as total FROM item_actual_pengeluaran WHERE idActualPengeluaran = ?', [data[0].idActualPengeluaran]);

                if (count[0].total === null) {
                    count[0].total = 0;
                }
                
                await db.execute('UPDATE actual_pengeluaran SET Total_Actual_Pengeluaran = ? WHERE idActualPengeluaran = ?', [count[0].total, data[0].idActualPengeluaran]);
            }

            res.status(200).send({
                error: false,
                message: 'Update status success',
            });
        } else {
            res.status(400).send({
                error: false,
                message: 'Hmmm, something wrong with your input!'
            });
        }
    } catch (err) {
        console.error('Error during update data:',err);
        res.status(500).send({ error: true, message: 'Server error' }); 
    }
};