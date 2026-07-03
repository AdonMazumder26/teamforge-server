const User = require("./user.model");


const getCurrentUser = async (userId) => {
    return await User.findById(userId).select("-password");
};

const updateProfile = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select("-password");
};

const getUserByUsername = async (username) => {
    return await User.findOne({ username }).select("-password");
};

const getAllUsers = async () => {
    return await User.find().select("-password");
};

module.exports = {
    updateProfile, getCurrentUser, getUserByUsername, getAllUsers,
};