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
        const [users] = await db.execute('SELECT id, username, role FROM users WHERE role = "guest" OR role = "user" OR role = "approval" LIMIT ? OFFSET ?', [pageSize, offset]);
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
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [uid]);

        res.status(200).send({
            error: false,
            message: 'User detail fetched successfully',
            users: {
                id: user[0].id,
                email: user[0].email,
                username: user[0].username,
                role: user[0].role,
                dateTimeRegistered: user[0].create_at
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
    const { role } = req.body;

    try {
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, uid]);
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [uid]);
        res.status(200).send({
            error: false,
            message: 'Enroll successfully',
            users: {
                id: user[0].id,
                email: user[0].email,
                username: user[0].username,
                role: user[0].role,
                dateTimeRegistered: user[0].create_at
            },
        });
    } catch (err) {
        console.error('Error during enrolling:', err);
        res.status(500).send({ error: true, message: 'Server error'});
    }
};