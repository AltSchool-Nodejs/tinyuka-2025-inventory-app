const authService = require('./auth.service');

const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;
    const { token, user } = await authService.registerUser({ name, email, password });
    res.status(201).json({ token, user });
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);
    res.status(200).json({ token, user });
}

module.exports = { registerUserController, loginUserController };