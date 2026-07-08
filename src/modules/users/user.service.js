const User = require("./user.model");
const { uploadFile, deleteFile } = require("../../utils/cloudinaryUpload");


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

const uploadProfileImage = async (userId, file) => {
    const User = require("./user.model");

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    // Delete old profile image if it exists
    if (user.profileImage?.publicId) {
        await deleteFile(user.profileImage.publicId);
    }

    // Upload new image
    const result = await uploadFile(
        file,
        "teamforge/users",
        "image"
    );

    user.profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
    };

    await user.save();

    return user;
};

module.exports = {
    updateProfile, getCurrentUser, getUserByUsername, getAllUsers, uploadProfileImage
};