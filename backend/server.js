const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Book = require('./models/Book');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allows large book payloads (images/pages)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.error('❌ Database connection error:', err));

// 1. GET all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // -1 means descending (newest first)
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET a specific book by custom id or MongoDB _id
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({
      $or: [
        { id: req.params.id }, 
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}\$/) ? req.params.id : null }
      ]
    });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST a new book (Added back here)
app.post('/api/books', async (req, res) => {
  try {
    const bookPayload = {
      ...req.body,
      id: req.body.id || Date.now().toString(),
      createdAt: req.body.createdAt || new Date()
    };
    const newBook = new Book(bookPayload);
    const savedBook = await newBook.save(); // Saves permanently to MongoDB Atlas
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error saving book:", err);
    res.status(500).json({ error: err.message || 'Failed to save book to database' });
  }
});

// 4. PUT (Update) an existing book by custom id or MongoDB _id
app.put('/api/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      req.body,
      { new: true } // Returns the updated document
    );

    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE a book by custom id or MongoDB _id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({
      $or: [{ id: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });

    if (deletedBook) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login route
app.post('/api/admin/login', (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  console.log("ENV PASSWORD:", process.env.ADMIN_PASSWORD);

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, message: 'Authenticated successfully' });
  } else {
    return res.status(401).json({ success: false, message: 'Incorrect admin password' });
  }
});

app.get('/', (req, res) => {
  res.send('📚 StoryToon Backend is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});