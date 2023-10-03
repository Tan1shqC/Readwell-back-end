const User = require('../models/User');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, userName, roles, active, password } = req.body;

    // Confirm Data
    if (!id || !userName || !Array.isArray(roles) || roles.len || typeof (active) !== 'boolean') {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id).exex();

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check for Duplicate
    const duplicate = await User.findOne({ userName }).lean().exec();
    // Allow Updates to the Original User
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "UserName taken" });
    }

    user.userName = userName;
    user.roles = roles;
    user.active = active;

    if (password) {
        const hashedPwd = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser} updated` });
});

// @desc delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findById(id).exex();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne();

    const reply = `UserName ${result.userName} with ID ${result._id} `;
    res.json(reply);
});

const getCartItems = asyncHandler(async (req, res) => {
    // import the books from the Book model and send as the cart
    const user = await User.findOne({ userName: req.query.user }).exec();
    const items = await Promise.all(user.cart.map(async (id) => {
        const item = await Book.findById(id).exec();
        return item;
    }));

    res.json(items);
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { user: userName, id } = req.body;

    const user = await User.findOne({ userName }).exec();

    // check for duplicates
    if (!(user.cart.find(val => (val===id)))) {
        user.cart.push(id);
        user.save();
    }

    res.json({ message: "Successfully Updated" });
});

const removeItem = asyncHandler(async (req, res) => {
    const { user: userName, id } = req.query;
    // console.log(`${user} ${id}`);

    // remove items from mongodb database
    const user = await User.findOne({ userName }).exec();
    user.cart = user.cart.filter(val => (val !== id));
    user.save();

    res.json({ message: "Successfully Deleted" });
});

module.exports = { updateUser, deleteUser, getCartItems, addItemToCart, removeItem };