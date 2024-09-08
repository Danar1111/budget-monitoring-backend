const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles, authorizeDivision } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const supervisorController = require('../controllers/supervisorController');
const actualController = require('../controllers/actualController');
const approverController = require('../controllers/approverController');
const financeController = require('../controllers/financeController');

router.use(cors({
    origin: '*',
    method: ["GET","POST","DELETE","PUT"]
}));

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

router.get(
    '/forecast-income',
    authenticateToken,
    (req, res, next) => {
        supervisorController.getMonthlyForecastIncome(req, res, next);
    }
)

router.put(
    '/forecast-income/submit/:fid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.monthlyForecastIncome(req, res, next);
    }
)

router.post(
    '/kategori-forecast-income',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.monthlyCategoryForecastIncome(req, res, next);
    }
)

router.get(
    '/forecast-income/:fid',
    authenticateToken,
    (req, res, next) => {
        supervisorController.getMonthlyCategoryForecastIncome(req, res, next);
    }
)

router.put(
    '/forecast-income/:cid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.updateMonthlyCategoryForecastIncome(req, res, next);
    }
)

router.delete(
    '/forecast-income/:cid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.deleteMonthlyCategoryForecastIncome(req, res, next);
    }
)

router.get(
    '/forecast-outcome',
    authenticateToken,
    (req, res, next) => {
        supervisorController.getMonthlyForecastOutcome(req, res, next);
    }
)

router.put(
    '/forecast-outcome/submit/:fid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.monthlyForecastOutcome(req, res, next);
    }
)

router.post(
    '/kategori-forecast-outcome',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.monthlyCategoryForecastOutcome(req, res, next);
    }
)

router.get(
    '/forecast-outcome/:fid',
    authenticateToken,
    (req, res, next) => {
        supervisorController.getMonthlyCategoryForecastOutcome(req, res, next);
    }
)

router.put(
    '/forecast-outcome/:cid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.updateMonthlyCategoryForecastOutcome(req, res, next);
    }
)

router.delete(
    '/forecast-outcome/:cid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        supervisorController.deleteMonthlyCategoryForecastOutcome(req, res, next);
    }
)

router.get(
    '/actual-outcome',
    authenticateToken,
    (req, res, next) => {
        actualController.getMonthlyActualOutcome(req, res, next);
    }
)

router.post(
    '/item-actual-outcome',
    authenticateToken,
    (req, res, next) => {
        actualController.itemMonthlyActualOutcome(req, res, next);
    }
)

router.get(
    '/actual-outcome/:aid',
    authenticateToken,
    (req, res, next) => {
        actualController.getItemMonthlyActualOutcome(req, res, next);
    }
)

router.get(
    '/request-item-actual-outcome/:aid',
    authenticateToken,
    (req, res, next) => {
        actualController.getRequestItemMonthlyActualOutcome(req, res, next);
    }
)

router.put(
    '/request-item-actual-outcome/:iid',
    authenticateToken,
    (req, res, next) => {
        actualController.updateRequestItemMonthlyActualOutcome(req, res, next);
    }
)

router.delete(
    '/request-item-actual-outcome/:iid',
    authenticateToken,
    (req, res, next) => {
        actualController.deleteRequestItemMonthlyActualOutcome(req, res, next);
    }
)

router.get(
    '/getforecastincome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getForecastPemasukan(req, res, next);
    }
)

router.get(
    '/getallforecastincome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getAllForecastPemasukan(req, res, next);
    }
)

router.get(
    '/getdetailforecastincome/:id',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getDetailForecastPemasukan(req, res, next);
    }
)

router.get(
    '/getkategoriforecastincome/:id',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getKategoriForecastPemasukan(req, res, next);
    }
)

router.get(
    '/getforecastoutcome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getForecastPengeluaran(req, res, next);
    }
)

router.get(
    '/getallforecastoutcome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getAllForecastPengeluaran(req, res, next);
    }
)

router.get(
    '/getdetailforecastoutcome/:id',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getDetailForecastPengeluaran(req, res, next);
    }
)

router.get(
    '/getkategoriforecastoutcome/:id',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.getKategoriForecastPengeluaran(req, res, next);
    }
)

router.post(
    '/setstatusforecastincome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.approveToForecastPemasukan(req, res, next);
    }
)

router.post(
    '/setstatusforecastoutcome',
    authenticateToken,
    authorizeRoles('supervisor'),
    authorizeDivision('finance'),
    (req, res, next) => {
        approverController.approveToForecastPengeluaran(req, res, next);
    }
)

router.get(
    '/getrequestactual/:aid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        approverController.getActualRequest(req, res, next);
    }
)

router.get(
    '/getdetailrequestactual/:aid',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        approverController.getDetailActualRequest(req, res, next);
    }
)

router.post(
    '/setstatusrequest',
    authenticateToken,
    authorizeRoles('supervisor'),
    (req, res, next) => {
        approverController.approveToActualRequest(req, res, next);
    }
)

router.get(
    '/actual-income',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.monthlyActualIncome(req, res, next);
    }
)

router.post(
    '/item-actual-income',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.itemMonthlyActualIncome(req, res, next);
    }
)

router.get(
    '/item-actual-income/:aid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.getItemMonthlyActualIncome(req, res, next);
    }
)

router.put(
    '/item-actual-income/:iid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.updateItemMonthlyActualIncome(req, res, next);
    }
)

router.delete(
    '/item-actual-income/:iid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.deleteItemMonthlyActualIncome(req, res, next);
    }
)

router.get(
    '/finance-actual-outcome',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.monthlyActualOutcome(req, res, next);
    }
)

router.get(
    '/item-actual-outcome/:aid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.getItemMonthlyActualOutcome(req, res, next);
    }
)

router.put(
    '/item-actual-outcome/:aid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.updateItemMonthlyActualOutcome(req, res, next);
    }
)

router.delete(
    '/item-actual-outcome/:aid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.deleteItemMonthlyActualOutcome(req, res, next);
    }
)

router.get(
    '/get-all-category-income/:aid',
    authenticateToken,
    authorizeDivision('finance'),
    (req, res, next) => {
        financeController.getAllCategory(req, res, next);
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