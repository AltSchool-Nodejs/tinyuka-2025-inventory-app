const UserModel = require('../user/user.model');
const { generateToken } = require('../libs/jwt');

const registerUser = async ({ name, email, password }) => {
    const newUser = await UserModel.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
    });

    const token = generateToken({ email: newUser.email, userId: newUser._id });

    // remove password from user
    newUser.password = undefined;

    return { token, user: newUser.toObject() };
}

const loginUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken({ email: user.email, userId: user._id });

    // remove password from user
    user.password = undefined;

    return { token, user: user.toObject() };
}

module.exports = { registerUser, loginUser };