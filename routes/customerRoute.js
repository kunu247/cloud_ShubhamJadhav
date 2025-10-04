const express = require('express')
const router = express.Router();

const {getAllCustomers, register, login, admin} = require('../controllers/customerController')

router.route('/').get(getAllCustomers);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/admin').get(admin);



module.exports = router;