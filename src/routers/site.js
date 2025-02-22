const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController.js');
const productController = require('../app/controllers/ProductController.js');
// NewsController.index();


router.get('/homeShop', productController.homeShop);
router.get('/:search', siteController.search);
router.get('/', siteController.index);
module.exports = router;
