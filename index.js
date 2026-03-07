const express = require('express');
const port = process.env.PORT || 8000;
const itemsService = require('./items/items.service');

const app = express(); // initialize express

app.use(express.json()); // middleware to parse the body of the request

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// create a new item
app.post('/v1/items', (req, res) => {
    const bodyOfRequest = req.body;
    const newItem = itemsService.createItem(bodyOfRequest);
    res.status(201).json(newItem);
});

// get all items
app.get('/v1/items', (req, res) => {
    const items = itemsService.getItems();
    res.json(items);
});



// start the server/ listening for requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
