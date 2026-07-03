const { body } = require("express-validator");

const createStartupValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),

    body("tagline")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage("Tagline cannot exceed 150 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),

    body("technologies")
        .optional()
        .isArray()
        .withMessage("Technologies must be an array"),

    body("rolesNeeded")
        .optional()
        .isArray()
        .withMessage("Roles needed must be an array"),

    body("stage")
        .optional()
        .isIn([
            "Idea",
            "Prototype",
            "MVP",
            "Launched",
            "Scaling",
        ])
        .withMessage("Invalid startup stage"),

    body("location")
        .optional()
        .trim(),

    body("website")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Website must be a valid URL"),
];



const updateStartupValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),

    body("tagline")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage("Tagline cannot exceed 150 characters"),

    body("description")
        .optional()
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),

    body("technologies")
        .optional()
        .isArray()
        .withMessage("Technologies must be an array"),

    body("rolesNeeded")
        .optional()
        .isArray()
        .withMessage("Roles needed must be an array"),

    body("stage")
        .optional()
        .isIn([
            "Idea",
            "Prototype",
            "MVP",
            "Launched",
            "Scaling",
        ])
        .withMessage("Invalid startup stage"),

    body("website")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Website must be a valid URL"),
];

module.exports = {
    createStartupValidation, updateStartupValidation
};