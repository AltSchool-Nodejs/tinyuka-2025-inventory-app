const itemsService = require('./items.service');

const createItemController = (req, res) => {
    const bodyOfRequest = req.body;
    const newItem = itemsService.createItem(bodyOfRequest);
    res.status(201).json(newItem);
}

module.exports = { createItemController };