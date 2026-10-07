const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: { type: String }
});

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keep your custom string id
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    coverImage: { type: String },
    pages: [pageSchema], // Array of pages using the sub-schema above
    createdAt: { type: Date }
});

module.exports = mongoose.model('Book', bookSchema);