const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');
const crypto = require('crypto');

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error : errors.array() });
    }

    const { email, password } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM users LEFT JOIN divisi on users.idDivisi = divisi.idDivisi WHERE email = ?', [email]);
        if (user.length === 0 ) {
            return res.status(400).json({error: true, message: 'Invalid Credentials'});
        }

        const validPassword = await bcrypt.compare(password, user[0].Password);

        if (!validPassword) {
            return res.status(400).json({error: true, message: 'Wrong Password'});
        }

        // redirect page

        let redirecUrl;
        if (user[0].Role === 'supervisor' && user[0].Nama_Divisi === 'admin') {
            redirecUrl = '/admin';
        } else if (user[0].Role === 'supervisor' && user[0].Nama_Divisi === 'finance') {
            redirecUrl = '/finance';
        } else if (user[0].Role === 'supervisor') {
            redirecUrl = '/supervisor';
        } else if (user[0].Role === 'user') {
            redirecUrl = '/home';
        } else {
            return res.status(200).json({error: true, message: 'not enrolled yet'});
        }

        const token = jwt.sign({ id: user[0].idUser , divisi: user[0].Nama_Divisi, role: user[0].Role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', token).send({
            error: false,
            message: 'Login Successfully',
            loginResult: {
                id: user[0].idUser,
                email: email,
                nama: user[0].Nama,
                role: user[0].Role,
                divisi: user[0].Nama_Divisi,
                token,
                redirecUrl,
            }
        });
    } catch (err) {
        console.error('Error during user login:', err);
        res.status(500).send({ error: true, message: 'Server Error' });
    };
};

const generatedId = () => {
    return 'UID-' + crypto.randomBytes(8).toString('base64');
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    };

    const { email, nama, password } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length > 0) {
            return res.status(400).json({ error: true, message: 'Email already exist'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = generatedId();

        const role = 'guest';

        await db.execute('INSERT INTO users (idUser, Email, Nama, Role, Password) VALUES (?, ?, ?, ?, ?)', [userId, email, nama, role, hashedPassword]);

        res.status(200).send({
            error: false,
            message: 'User registered, please contact admin for enroll your position',
            user:{
                id: userId,
                email: email,
                nama: nama,
                role: role
            }
        });
    } catch (err) {
        console.error('Error during registration:',err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};