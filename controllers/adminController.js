const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { page } = req.query;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const pageSize = 20;
    const offset = (pageNumber - 1) * pageSize;

    try {
        const [users] = await db.execute('SELECT idUser, Nama, Role, Nama_Divisi FROM users LEFT JOIN divisi on users.idDivisi = divisi.idDivisi', [pageSize, offset]);
        const [total] = await db.execute('SELECT COUNT(*) as total FROM users');
        const totalUser = total[0].total;

        res.status(200).send({
            error: false,
            message: 'Users fetched successfully',
            totalUser: totalUser,
            currentPage: pageNumber,
            pageSize: pageSize,
            users: users
        });
    } catch (err) {
        console.error('Erorr fetching users:', err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};

exports.getDetailUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { uid } = req.params;

    try {
        const [user] = await db.execute('SELECT * FROM users LEFT JOIN divisi on users.idDivisi = divisi.idDivisi WHERE idUser = ?', [uid]);
        let report = null;
        let report_to_fix = null;
        if (user[0].Report_to) {
            report = await db.execute('SELECT Nama FROM users WHERE idUser = ?', [user[0].Report_to]);
            report_to_fix = report[0][0].Nama;
        }

        res.status(200).send({
            error: false,
            message: 'User detail fetched successfully',
            users: {
                id: user[0].idUser,
                nama: user[0].Nama,
                email: user[0].Email,
                role: user[0].Role,
                report_to: report_to_fix,
                divisi: user[0].Nama_Divisi,
                dateTimeRegistered: user[0].CreateAt
            },
        });
    } catch (err) {
        console.error('Erorr fetching user detail:', err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};

exports.enrollUsers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { uid } = req.params;
    const { role , idDivisi} = req.body;
    let { report_to } =req.body;

    if (!report_to) {
        report_to = null;
    }

    const report_to_fix = report_to;

    try {
        await db.execute('UPDATE users SET Role = ?, idDivisi = ?, Report_to = ? WHERE idUser = ?', [role, idDivisi, report_to_fix, uid]);
        const [user] = await db.execute('SELECT * FROM users LEFT JOIN divisi on users.idDivisi = divisi.idDivisi WHERE idUser = ?', [uid]);
        res.status(200).send({
            error: false,
            message: 'Enroll successfully',
            users: {
                id: user[0].idUser,
                nama: user[0].Nama,
                email: user[0].Email,
                role: user[0].Role,
                report_to: user[0].Report_to,
                divisi: user[0].Nama_Divisi,
                dateTimeRegistered: user[0].CreateAt
            },
        });
    } catch (err) {
        console.error('Error during enrolling:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};

exports.addDvision = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { idDivisi, Nama_Divisi } = req.body;

    try {
        await db.execute('INSERT INTO divisi VALUES (?, ?)', [idDivisi, Nama_Divisi])

        res.status(200).send({
            error: false,
            message: 'Successfully added division',
            idDivisi: idDivisi,
            Nama_Divisi: Nama_Divisi
        });
    } catch (err) {
        console.error('Error during adding division:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};

exports.getDivision = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const [divisi] = await db.execute('SELECT * FROM divisi');

        res.status(200).send({
            error: false,
            message: 'Division fetched successfully',
            divisi: divisi
        });
    } catch (err) {
        console.error('Error fetching division:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};