const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController.js');
router.post('/updateQuantity', productController.updateCartItemQuantity);
router.post('/order', productController.createOrder);
router.delete('/:id', productController.destroy);
router.get('/', productController.showCart);
module.exports = router;