const { validationResult } = require("express-validator");
const applicationService = require("./application.service");
const applicationReviewService = require("./application.review.service");
const applicationStatusService = require("./application.status.service");

const applyToStartup = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: errors.array(),
            });
        }

        const application =
            await applicationService.applyToStartup(
                req.body,
                req.user._id
            );

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            data: application,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const result =
            await applicationService.getMyApplications(
                req.user._id,
                req.query
            );

        return res.status(200).json({
            success: true,
            message: "Applications fetched successfully.",
            data: result,
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
};

const getStartupApplications = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const result =
            await applicationService.getStartupApplications(
                req.params.startupId,
                req.user._id,
                req.query
            );

        return res.status(200).json({
            success: true,
            message: "Applications fetched successfully.",
            data: result,
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
};

const withdrawApplication = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const application =
            await applicationService.withdrawApplication(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({
            success: true,
            message: "Application withdrawn successfully.",
            data: application,
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
};

const reviewApplication = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { id } = req.params;

        const reviewedApplication =
            await applicationReviewService.reviewApplication(
                id,
                req.user._id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Application reviewed successfully.",
            data: reviewedApplication,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        const updatedApplication =
            await applicationStatusService.updateApplicationStatus(
                id,
                req.user._id,
                status
            );

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            data: updatedApplication,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const apply = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const application =
            await applicationService.applyToStartup(
                req.body,
                req.user._id,
                req.file
            );

        return res.status(201).json({
            success: true,
            message:
                "Application submitted successfully.",
            data: application,
        });
    } catch (error) {


        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application =
            await applicationService.getApplicationById(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({
            success: true,
            data: application,
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });

    }
};


module.exports = {
    applyToStartup, getMyApplications, getStartupApplications, withdrawApplication, reviewApplication, updateApplicationStatus, apply, getApplicationById
};