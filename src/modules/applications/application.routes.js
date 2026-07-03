const express = require("express");
const router = express.Router();

const applicationController = require("./application.controller");
const {
    applyValidation,
    getStartupApplicationsValidation,
    withdrawApplicationValidation,
} = require("./application.validation");
const protect = require("../../middleware/auth.middleware");
const { getApplicationsValidation } = require("./application.query.validation");

router.post(
    "/",
    protect,
    applyValidation,
    applicationController.applyToStartup
);

router.get(
    "/me",
    protect,
    getApplicationsValidation,
    applicationController.getMyApplications
);

router.get(
    "/startup/:startupId",
    protect,
    getApplicationsValidation,
    getStartupApplicationsValidation,
    applicationController.getStartupApplications
);

router.patch(
    "/:id/withdraw",
    protect,
    withdrawApplicationValidation,
    applicationController.withdrawApplication
);

module.exports = router;