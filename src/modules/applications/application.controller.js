const { validationResult } = require("express-validator");
const applicationService = require("./application.service");

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
            ...result,
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
            ...result,
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

module.exports = {
    applyToStartup, getMyApplications, getStartupApplications, withdrawApplication
};