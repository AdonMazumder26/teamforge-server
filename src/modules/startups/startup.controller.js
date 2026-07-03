const { validationResult } = require("express-validator");
const startupService = require("./startup.service");

const createStartup = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const startupData = {
            title: req.body.title,
            tagline: req.body.tagline,
            description: req.body.description,
            technologies: req.body.technologies || [],
            rolesNeeded: req.body.rolesNeeded || [],
            stage: req.body.stage,
            location: req.body.location,
            website: req.body.website,
            founder: req.user._id,
        };

        const startup = await startupService.createStartup(startupData);

        res.status(201).json({
            success: true,
            message: "Startup created successfully",
            startup,
        });
    } catch (error) {
        console.error(error);
        if (error.message === "You already have a startup with this title.") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getAllStartups = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const result = await startupService.getAllStartups(req.query);

        res.status(200).json({
            success: true,
            message: "Startups retrieved successfully.",
            pagination: result.pagination,
            sort: result.sort,
            data: result.startups,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve startups.",
        });
    }
};

const getStartupById = async (req, res) => {
    try {
        const startup = await startupService.getStartupById(req.params.id);

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: "Startup not found",
            });
        }

        res.status(200).json({
            success: true,
            startup,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid startup ID",
            });
        }

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateStartup = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "tagline",
            "description",
            "technologies",
            "rolesNeeded",
            "stage",
            "location",
            "website",
            "logo",
            "isHiring",
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const startup = await startupService.updateStartup(
            req.params.id,
            updateData
        );

        res.status(200).json({
            success: true,
            message: "Startup updated successfully",
            startup,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const deleteStartup = async (req, res) => {
    try {
        await startupService.deleteStartup(req.params.id);

        res.status(200).json({
            success: true,
            message: "Startup deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createStartup, getAllStartups, getStartupById, updateStartup, deleteStartup
};