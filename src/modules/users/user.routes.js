const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const userController = require("./user.controller");
const {
    updateProfileValidation,
} = require("./user.validation");

router.patch(
    "/profile",
    authMiddleware,
    updateProfileValidation,
    userController.updateProfile
);

router.get(
    "/profile",
    authMiddleware,
    userController.getCurrentUser
);

router.get("/", userController.getAllUsers);

router.get("/:username",
    userController.getUserByUsername
);

module.exports = router;