const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./models/Book');
const booksData = require('./books.json'); // Import your JSON data

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing books to avoid duplication errors (optional)
        await Book.deleteMany({});
        console.log('🗑️ Cleared old books from database.');

        // Insert the JSON data into MongoDB
        await Book.insertMany(booksData);
        console.log('🎉 Successfully imported all books from books.json into MongoDB!');

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();