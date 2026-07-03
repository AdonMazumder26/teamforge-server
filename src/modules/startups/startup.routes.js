const express = require("express");

const router = express.Router();

const protect = require("../../middleware/auth.middleware");

const startupController = require("./startup.controller");
const startupOwnerMiddleware = require("../../middleware/startupOwner.middleware");


const {
    createStartupValidation,
    updateStartupValidation,
} = require("./startup.validation");

const startupQueryValidation = require("./startup.query.validation");


router.get("/", startupQueryValidation, startupController.getAllStartups);
router.get("/:id", startupController.getStartupById);

router.post(
    "/",
    protect,
    createStartupValidation,
    startupController.createStartup
);

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


module.exports = router;