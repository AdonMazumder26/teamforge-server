const bcrypt = require("bcryptjs");
const User = require("../users/user.model");
const { generateToken } = require("../../utils/generateToken");

const registerUser = async (userData) => {
    const { name, username, email, password, role } = userData;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new Error("Email already exits.")
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
        throw new Error("Username already exits.")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role
    })

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;



    return userWithoutPassword;
}

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");

    }

    const token = generateToken({ userId: user._id });

    const userObject = user.toObject();

    delete userObject.password;

    return {
        token,
        user: userObject
    }
}

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
}