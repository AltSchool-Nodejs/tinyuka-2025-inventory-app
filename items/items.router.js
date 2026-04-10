const express = require('express');
const itemsService = require('./items.service');
const itemMiddleware = require('./items.middleware');
const itemController = require('./items.controller');
const { authenticateToken } = require('../auth/auth.middleware');
const router = express.Router();


// create a new item
router.post('/', itemMiddleware.validateItem, authenticateToken, itemController.createItemController);

// get all items
router.get('/', authenticateToken, async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const name = req.query.name || null;

    const items = await itemsService.getItems({ page, limit, name });
    res.json(items);
});

// get a single item - id is the path parameter for the request
router.get('/:id', authenticateToken, async (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;
    const item = await itemsService.getItemById(id);

    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
});

router.patch('/:itemId', authenticateToken, async (req, res) => {
    const { itemId } = req.params;
    const bodyOfRequest = req.body;

    const item = await itemsService.getItemById(itemId);

    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // { id: '7lmrx03sfgg', name: 'shirt', quantity: 10, exp_date: '2027-02-10' }
    // { name: 'pants', quantity: 20 }
    // { id: '7lmrx03sfgg', name: 'pants', quantity: 20, exp_date: '2027-02-10' }
    const newItem = { ...item, ...bodyOfRequest }


    const updatedItem = await itemsService.updateItem(itemId, newItem);


    return res.json(updatedItem);
})

router.delete('/:itemId', authenticateToken, async (req, res) => {
    const { itemId } = req.params;
    const deleted = await itemsService.deleteItem(itemId);
    if (!deleted) {
        return res.status(404).json({ message: 'Item not found' });
    }
    return res.json({ message: 'Item deleted' });
})


module.exports = router;