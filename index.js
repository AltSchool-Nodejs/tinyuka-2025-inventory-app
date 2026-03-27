const express = require('express');
const port = process.env.PORT || 8000;
const itemsRouter = require('./items/items.router');
const itemsService = require('./items/items.service');
const path = require('path');
const { connectDB } = require('./config/database');
const app = express(); // initialize express

app.use(express.json()); // middleware to parse the body of the request

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// static files
app.use('/public', express.static('public'));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/items', (req, res) => {
    const items = itemsService.getItems();
    res.render('index', { allItems: items });
});



app.use('/v1/items', itemsRouter);

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});



// connect to the database
connectDB();
// start the server/ listening for requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
