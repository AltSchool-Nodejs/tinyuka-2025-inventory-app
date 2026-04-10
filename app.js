const express = require('express');
const path = require('path');
const itemsRouter = require('./items/items.router');
const itemsService = require('./items/items.service');
const authRouter = require('./auth/auth.router');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.use('/public', express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/items', async (req, res, next) => {
    try {
        const items = await itemsService.getItems({ page: 1, limit: 10 });
        res.render('index', { allItems: items });
    } catch (error) {
        next(error);
    }
});

app.use('/v1/items', itemsRouter);
app.use('/v1/auth', authRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
