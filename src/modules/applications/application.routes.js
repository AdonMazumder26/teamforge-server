const express = require("express");
const router = express.Router();

const applicationController = require("./application.controller");
const {
    applyValidation,
    getStartupApplicationsValidation,
    withdrawApplicationValidation,
    reviewApplicationValidation,
    updateStatusValidation,
} = require("./application.validation");
const protect = require("../../middleware/auth.middleware");
const { getApplicationsValidation } = require("./application.query.validation");
const { resumeUpload } = require("../../middleware/upload.middleware");


// router.post(
//     "/",
//     protect,
//     applyValidation,
//     applicationController.applyToStartup
// );

router.post(
    "/",
    protect,
    resumeUpload.single("resume"),
    applyValidation,
    applicationController.apply
);


router.get(
    "/me",
    protect,
    getApplicationsValidation,
    applicationController.getMyApplications
);

router.patch(
    "/:id/withdraw",
    protect,
    withdrawApplicationValidation,
    applicationController.withdrawApplication
);

router.get(
    "/startup/:startupId",
    protect,
    getApplicationsValidation,
    getStartupApplicationsValidation,
    applicationController.getStartupApplications
);

router.post(
    "/:id/review",
    protect,
    reviewApplicationValidation,
    applicationController.reviewApplication
);

router.get(
    "/:id",
    protect,
    applicationController.getApplicationById
);

router.patch(
    "/:id/status",
    protect,
    updateStatusValidation,
    applicationController.updateApplicationStatus
);


module.exports = router;