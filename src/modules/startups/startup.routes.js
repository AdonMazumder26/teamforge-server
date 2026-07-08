const express = require("express");

const router = express.Router();

const protect = require("../../middleware/auth.middleware");

const startupController = require("./startup.controller");
const startupOwnerMiddleware = require("../../middleware/startupOwner.middleware");
const { imageUpload } = require("../../middleware/upload.middleware");


const {
    createStartupValidation,
    updateStartupValidation,
} = require("./startup.validation");

const startupQueryValidation = require("./startup.query.validation");


router.get("/", startupQueryValidation, startupController.getAllStartups);

router.post(
    "/",
    protect,
    createStartupValidation,
    startupController.createStartup
);

router.get(
    "/me",
    protect,
    startupController.getMyStartups
);

router.get("/:id", startupController.getStartupById);
router.patch(
    "/:id",
    protect,
    startupOwnerMiddleware,
    updateStartupValidation,
    startupController.updateStartup
);

router.delete(
    "/:id",
    protect,
    startupOwnerMiddleware,
    startupController.deleteStartup
);


router.patch(
    "/:id/logo",
    protect,
    startupOwnerMiddleware,
    imageUpload.single("logo"),
    startupController.uploadStartupLogo
);

module.exports = router;