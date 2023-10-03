const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/cart')
    .get(userController.getCartItems)
    .post(userController.addItemToCart)
    .delete(userController.removeItem);

module.exports = router;