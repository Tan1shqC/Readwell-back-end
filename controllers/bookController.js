const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

const search = asyncHandler(async (req, res) => {
    console.log(req.headers);
    console.log(req.body);
    console.log(req.query);
    const ret = await Book.find({ title: new RegExp(req.query.name, "i") }).limit(50).exec();

    return res.status(201).json(ret);
});

const getBookById = asyncHandler(async (req, res) => {
    const id = req.query.id;
    // console.log(id);

    const ret = await Book.findById(id);
    // console.log(ret);

    return res.status(200).json(ret);
});

module.exports = { search, getBookById };