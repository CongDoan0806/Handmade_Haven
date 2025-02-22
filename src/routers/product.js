const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController.js');
router.get('/:slug', productController.detail);
router.post('/addToCart', productController.addToCart);
module.exports = router;