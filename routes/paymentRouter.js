const express = require('express');
const { getAllPayments, createPayment, getSinglePayment } = require('../controllers/paymentController');
const router = express.Router();


router.route('/').get(getAllPayments).post(createPayment);
router.route('/:id').get(getSinglePayment); 




module.exports = router;