const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error : errors.array()});
    }

    const { email, password } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0 ) {
            return res.status(400).json({error: true, message: 'Invalid Credentials'});
        }

        const validPassword = user[0].password === password;

        // const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({error: true, message: 'Wrong Password'});
        }

        let redirecUrl;
        if (user[0].role === 'admin') {
            redirecUrl = '/admin';
        } else if (user[0].role === 'approval') {
            redirecUrl = '/approval';
        } else if (user[0].role === 'user') {
            redirecUrl = '/home';
        } else {
            return res.status(200).json({error: true, message: 'not enrolled yet'});
        }

        const token = jwt.sign({ id: user[0].id , role: user[0].role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', token).send({
            error: false,
            message: 'Login Successfully',
            loginResult: {
                userID: user[0].id,
                email: email,
                username: user[0].username,
                token,
                redirecUrl,
            }
        });
    } catch (err) {
        console.log('Error during user login:', err);
        res.status(500).send({ error: true, message: 'Server Error' });
    };
};

exports.register = async (req, res) => {

};