const validateItem = (req, res, next) => {
    const { name, quantity, exp_date } = req.body;
    if (!name || !quantity || !exp_date) {
        return res.status(400).json({ message: 'Name or quantity or exp_date are required' });
    }
    next();
}

const validateItemId = (req, res, next) => {
    const { itemId } = req.params;
    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required' });
    }
    next();
}

module.exports = { validateItem };