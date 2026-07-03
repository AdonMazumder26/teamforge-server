const { query } = require("express-validator");

const startupQueryValidation = [
    query("search")
        .optional()
        .trim(),

    query("technology")
        .optional()
        .trim(),

    query("role")
        .optional()
        .trim(),

    query("stage")
        .optional()
        .isIn([
            "Idea",
            "Prototype",
            "MVP",
            "Growth",
            "Scaling",
        ])
        .withMessage("Invalid startup stage."),

    query("location")
        .optional()
        .trim(),

    query("isHiring")
        .optional()
        .isBoolean()
        .withMessage("isHiring must be true or false."),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50."),

    query("sort")
        .optional()
        .isIn([
            "newest",
            "oldest",
            "title",
        ])
        .withMessage("Invalid sort option."),

    query("fields")
        .optional()
        .trim(),
];

module.exports = startupQueryValidation;