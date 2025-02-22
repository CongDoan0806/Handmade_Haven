const express = require('express');
const router = express.Router();

const blogController = require('../app/controllers/BlogController.js');
router.get('/:id', blogController.detail);
router.post('/addComment', blogController.addComment);
router.get('/', blogController.index);
module.exports = router;