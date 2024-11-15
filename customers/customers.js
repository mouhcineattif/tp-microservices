require('dotenv').config();

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

const express = require('express');
const app = express();
const Customer = require('./Customer'); // Make sure 'Customer' is the correct model name and file path
// Ensure db.js is configured correctly to connect to MongoDB
const axios = require('axios');
const port = 5000;

app.use(express.json());

// POST: Create a new customer
app.post('/customers', async (req, res) => {
    try {
        const customer = new Customer({ ...req.body });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
});

// GET: Retrieve all customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve customers' });
    }
});

// GET: Retrieve a customer by ID
app.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve customer' });
    }
});

// PUT: Update a customer by ID
app.put('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
});

// DELETE: Delete a customer by ID
app.delete('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Customers service listening on port ${port}`);
});
