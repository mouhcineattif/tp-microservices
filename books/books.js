require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const Book = require('./Book');
const axios = require('axios');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

app.use(express.json());

// Create a new book
app.post('/books', async (req, res) => {
    try {
        if (!req.body.title || !req.body.authors || !req.body.description) {
            return res.status(400).send('Missing required fields: title, authors, or description');
        }

        // Create a new book using the provided data
        const book = new Book({
            title: req.body.title,
            authors: req.body.authors,
            description: req.body.description,
            publishedDate: req.body.publishedDate, // Optional field
            image: req.body.thumbnail, // Optional field
        });

        // Save the book to the database
        await book.save();
        
        // Respond with the saved book
        res.status(201).send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the book');
    }
});


// Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books); // Respond with the list of books
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the books');
    }
});

// Get a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.status(200).send(book); // Respond with the book details
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the book');
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (book) {
            res.status(200).send(book); // Respond with the updated book
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the book');
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (book) {
            res.status(200).send('Book deleted successfully'); // Respond with success message
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while deleting the book');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Book Services is Running on ${port}`);
});
