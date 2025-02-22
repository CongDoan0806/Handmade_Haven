const express = require("express");
const router = express.Router();
const momoController = require('../app/controllers/MomoController.js');

router.post('/', momoController.index); // Nhận yêu cầu thanh toán từ client
router.post('/ipn', momoController.ipn); // Xử lý IPN từ MoMo

module.exports = router;
