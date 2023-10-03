const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn13: Number,
    isbn10: Number,
    title: String,
    subtitle: String,
    authors: String,
    categories: String,
    thumbnail: String,
    description: String,
    published_year: Number,
    average_rating: Number,
    num_pages: Number,
    ratings_count: Number
});

module.exports = mongoose.model('Book', bookSchema);