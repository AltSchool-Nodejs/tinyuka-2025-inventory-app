const itemsService = require('./items.service');

const createItemController = async (req, res) => {
    const bodyOfRequest = req.body;
    const newItem = await itemsService.createItem(bodyOfRequest);
    res.status(201).json(newItem);
}

module.exports = { createItemController };