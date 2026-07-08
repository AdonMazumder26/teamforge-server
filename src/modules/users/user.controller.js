const { validationResult } = require("express-validator");
const userService = require("./user.service");

const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const allowedFields = [
            "name",
            "bio",
            "skills",
            "profileImage",
            "github",
            "linkedin",
            "portfolio",
            "location",
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const user = await userService.updateProfile(req.user._id, updateData);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {


        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await userService.getCurrentUser(req.user._id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {


        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await userService.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {


        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {


        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required.",
            });
        }

        const user = await userService.uploadProfileImage(
            req.user._id,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    updateProfile, getCurrentUser, getUserByUsername, getAllUsers, uploadProfileImage
};