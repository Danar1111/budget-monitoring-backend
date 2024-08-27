const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles, authorizeDivision } = require('../middlewares/authMiddleware');
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
        check('nama', 'Name is required').not().isEmpty(),
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

router.get(
    '/getallusers',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('admin'),
    (req, res, next) => {
        adminController.getUsers(req, res, next);
    }
)


router.post(
    '/adddivision',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('admin'),
    (req, res, next) => {
        adminController.addDvision(req, res, next);
    }
)

router.get(
    '/getdivision',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('admin'),
    (req, res, next) => {
        adminController.getDivision(req, res, next);
    }
)

// get dengan uid sebagai parameter harus paling bawah

router.get(
    '/:uid',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('admin'),
    (req, res, next) => {
        adminController.getDetailUser(req, res, next);
    }
)

router.post(
    '/:uid/enroll',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('admin'),
    (req, res, next) => {
        adminController.enrollUsers(req, res, next);
    }
)

module.exports = router;