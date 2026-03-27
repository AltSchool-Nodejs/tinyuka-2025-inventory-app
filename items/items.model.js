const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    exp_date: { type: Date, required: true },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
