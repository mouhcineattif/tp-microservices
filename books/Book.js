const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    numberPages : {
        type: Number,
        required: false
    },
    publisher: {
        type: String,
        required: false
    },
  
})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book