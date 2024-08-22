const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.post(
    '/login',
    [
        check('email', 'Email is required').not().isEmpty(),
        check('password', 'Password must be at least 8 characters').isLength({min: 8}),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        authController.login(req, res, next);
    }
)

router.post(
    '/register',
    [
        check('email', 'Email is require').not().isEmpty(),
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        authController.register(req, res, next);
    }
)

module.exports = router;