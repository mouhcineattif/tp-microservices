require('dotenv').config()
// const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Order = require('./Order')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));



const port = 9000

app.use(express.json())

app.post('/orders', async (req, res) => {
    try {
            const order = new Order({
                customerId: new mongoose.Types.ObjectId(req.body.customerId),
                bookId: new mongoose.Types.ObjectId(req.body.bookId),
                initialDate: new Date(req.body.initialDate),
                deliveryDate: new Date(req.body.deliveryDate)
            })
        await order.save()
        res.status(201).json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create order' })
    }
})

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to retrieve orders' })
    }
})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if (order) {
            axios.get(`http://localhost:5000/customer/${order.customerID}`).then((response) => {
                let orderObject = {
                    CustomerName: response.data.name,
                    BookTitle: ''
                };
                axios.get(`http://localhost:3000/book/${order.bookID}`).then((response) => {
                    orderObject.BookTitle = response.data.title;
                    res.json(orderObject);
                });
            });
        } else {
            res.status(404).send("Order not found");
        }
    }).catch((err) => {
        res.status(500).send("Internal Server Error!");
    });
});

app.get('/orders/customer/:customerId', async (req, res) => {
    try {
        const orders = await Order.find({ customerId: new mongoose.Types.ObjectId(req.params.customerId) });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Order service`);
});

