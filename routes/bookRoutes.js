const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.get('/search', bookController.search);

router.get('/find', bookController.getBookById);

module.exports = router;