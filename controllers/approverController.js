const db = require('../config/db');
const { validationResult } = require('express-validator');
const crypto = require('crypto')

exports.getForecastPemasukan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [data] = await db.execute('SELECT * FROM forecast_pemasukan WHERE');
        
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

exports.approveToForecastPemasukan = async (req, res ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { id, status } = req.body;

    try {
        await db.execute('UPDATE forecast_pemasukan SET isApproved = ? WHERE idForecastPemasukan = ?', [status, id]);

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

    try {
        await db.execute('UPDATE forecast_pengeluaran SET isApproved = ? WHERE idForecastPengeluaran = ?', [status, id]);

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
    const user_id = req.user.id;

    try {
        const [data] = await db.execute('SELECT r.* FROM request_item_actual_pengeluaran r JOIN users u ON r.idUser = u.idUser WHERE u.Report_to = ?', [user_id]);

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

    const { id, status, notes } = req.body;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    try {
        if (status === 'approved') {
            await db.execute('UPDATE request_item_actual_pengeluaran SET isApproved = ?, Notes = ? WHERE idRequest_item = ?',[status, notes, id]);
            const [id_request] = await db.execute('SELECT k.idKategori AS idKategori, k.Harga AS Harga_f, r.Harga AS Harga_a, r.idUser AS idUser, r.Nama_Item AS Nama_Item FROM request_item_actual_pengeluaran r JOIN kategori_forecast_pengeluaran k ON r.idKategori = k.idKategori WHERE idRequest_item = ?', [id]);

            const [divisi] = await db.execute('SELECT Nama, idDivisi from users WHERE idUser = ?',[id_request[0].idUser]);

            const [actual_outcome] = await db.execute('SELECT * FROM actual_pengeluaran WHERE idDivisi = ? AND Bulan = ? AND Tahun = ?', [divisi[0].idDivisi, currentMonth, currentYear]);

            const total_outcome = Number(actual_outcome[0].Total_Actual_Pengeluaran) + Number(id_request[0].Harga_a);

            await db.execute('UPDATE actual_pengeluaran SET Total_Actual_Pengeluaran = ? WHERE idDivisi = ? AND Bulan = ? AND Tahun = ?', [total_outcome, divisi[0].idDivisi, currentMonth, currentYear]);
            
            const sisa = id_request[0].Harga_f - id_request[0].Harga_a;

            let warn = false
            
            if (sisa < 0) {
                warn = true;
            }
            
            await db.execute('INSERT INTO item_actual_pengeluaran VALUES (?, ?, ?, ?, ?, ?, ?)',[id, actual_outcome[0].idActualPengeluaran, id_request[0].idUser, id_request[0].idKategori, id_request[0].Nama_Item, Number(id_request[0].Harga_a), sisa]);

            res.status(200).send({
                error: false,
                message: 'Update status success',
                warning: warn,
                testActual: {
                    total_outcome: total_outcome,
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
            await db.execute('UPDATE request_item_actual_pengeluaran SET isApproved = ?, Notes = ? WHERE idRequest_item = ?',[status, notes, id]);
            const [data] = await db.execute('SELECT * FROM item_actual_pengeluaran WHERE idItem = ?', [id]);
            const [actual] = await db.execute('SELECT * FROM actual_pengeluaran WHERE idActualPengeluaran = ?', [data[0].idActualPengeluaran]);
            if (data.length > 0) {
                await db.execute('DELETE FROM item_actual_pengeluaran WHERE idItem = ?', [id]);

                const count = Number(actual[0].Total_Actual_Pengeluaran) - Number(data[0].Harga);
                
                await db.execute('UPDATE actual_pengeluaran SET Total_Actual_Pengeluaran = ? WHERE idActualPengeluaran = ?', [count, data[0].idActualPengeluaran]);
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