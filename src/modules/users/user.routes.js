const express = require("express");
const router = express.Router();

    const userController = require("./user.controller");
const {
    updateProfileValidation,
} = require("./user.validation");
const { imageUpload } = require("../../middleware/upload.middleware");
const protect = require("../../middleware/auth.middleware");


router.patch(
    "/profile",
    protect,
    updateProfileValidation,
    userController.updateProfile
);

router.get(
    "/profile",
    protect,
    userController.getCurrentUser
);

router.get("/", userController.getAllUsers);

router.get("/:username",
    userController.getUserByUsername
);

router.patch(
    "/profile-image",
    protect,
    imageUpload.single("profileImage"),
    userController.uploadProfileImage
);

module.exports = router;