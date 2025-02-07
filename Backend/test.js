const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI= `mongodb://0.0.0.0/test`
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/register', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    res.status(200).send(`Name received: ${name}`);
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});