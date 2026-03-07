const items = [];

// { name: 'Item 1', quantity: 10, exp_date: '2026-01-01' }
const createItem = (item) => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const newItem = { id: randomId, ...item }; // { id: '123', name: 'Item 1', quantity: 10, exp_date: '2026-01-01' }
    items.push(newItem);
    return newItem;
};

const getItems = () => {
    return items;
};

const getItemById = (id) => {
    return items.find(item => item.id === id);
};

const updateItem = (id, item) => {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = item;
        return item;
    }
    return null;
};

const deleteItem = (id) => {
    const index = items.findIndex(item => item.id === id); 
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
};

module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
};