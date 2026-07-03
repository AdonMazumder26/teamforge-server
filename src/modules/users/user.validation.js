const { body } = require("express-validator");

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio cannot exceed 500 characters"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("github")
        .optional()
        .isURL()
        .withMessage("Invalid GitHub URL"),

    body("linkedin")
        .optional()
        .isURL()
        .withMessage("Invalid LinkedIn URL"),

    body("portfolio")
        .optional()
        .isURL()
        .withMessage("Invalid Portfolio URL"),

    body("location")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Location cannot exceed 100 characters"),
];

module.exports = {
    updateProfileValidation,
};