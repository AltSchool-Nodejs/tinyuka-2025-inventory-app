const ItemModel = require('./items.model');

// { name: 'Item 1', quantity: 10, exp_date: '2026-01-01' }
const createItem = async (item) => {
    // new changes were made here!
    // this just adds a new comment to make this function clearer
    const newItem = await ItemModel.create({
        name: item.name,
        quantity: item.quantity,
        exp_date: item.exp_date,
        color: 'black', 
    })

    return newItem;
};

const getItems = async ({ page, limit, name, quantity }) => {
    const skip = (page - 1) * limit;

    const query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }

    if (quantity) {
        query.quantity = { $eq: quantity };
    }

    const items = await ItemModel.find(query).skip(skip).limit(limit);
    return items;
};

const getItemById = async (id) => {
    const item = await ItemModel.findById(id);

    return item;
};


// { name: 'pants' }
const updateItem = async (id, item) => {
    const updatedItem = await ItemModel.findById(id)

    if (!updatedItem) {
        return null;
    }

    if (item.name) {
        updatedItem.name = item.name;
    }

    if (item.quantity) {
        updatedItem.quantity = item.quantity;
    }

    if (item.exp_date) {
        updatedItem.exp_date = item.exp_date;
    }

    await updatedItem.save();

    return updatedItem;
};

const deleteItem = async (id) => {
    const deletedItem = await ItemModel.deleteOne({ _id: id });

    return deletedItem.deletedCount > 0;
};

module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
};