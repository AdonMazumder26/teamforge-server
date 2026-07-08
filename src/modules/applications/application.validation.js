const { body } = require("express-validator");
const { param } = require("express-validator");
const {
    REVIEW_RECOMMENDATIONS,
} = require("./application.constants");

const { APPLICATION_STATUS } = require("./application.constants");


const applyValidation = [
    body("startupId")
        .notEmpty()
        .withMessage("Startup ID is required")
        .isMongoId()
        .withMessage("Invalid startup ID"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required"),

    body("message")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Message cannot exceed 1000 characters"),



    body("portfolio")
        .optional()
        .trim()
        .isURL()
        .withMessage("Portfolio must be a valid URL"),
];


const getStartupApplicationsValidation = [
    param("startupId")
        .isMongoId()
        .withMessage("Invalid startup ID."),
];


const withdrawApplicationValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid application ID."),
];


const reviewApplicationValidation = [
    body("score")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Score must be between 0 and 100"),

    body("recommendation")
        .optional()
        .isIn(REVIEW_RECOMMENDATIONS)
        .withMessage("Invalid recommendation"),

    body("strengths")
        .optional()
        .isArray()
        .withMessage("Strengths must be an array"),

    body("strengths.*")
        .optional()
        .isString()
        .trim(),

    body("weaknesses")
        .optional()
        .isArray()
        .withMessage("Weaknesses must be an array"),

    body("weaknesses.*")
        .optional()
        .isString()
        .trim(),

    body("matchedCriteria")
        .optional()
        .isArray()
        .withMessage("Matched criteria must be an array"),

    body("matchedCriteria.*")
        .optional()
        .isString()
        .trim(),

    body("missingCriteria")
        .optional()
        .isArray()
        .withMessage("Missing criteria must be an array"),

    body("missingCriteria.*")
        .optional()
        .isString()
        .trim(),

    body("interviewNotes")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Interview notes cannot exceed 2000 characters"),

    body("feedback")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Feedback cannot exceed 2000 characters"),
];


const updateStatusValidation = [
    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(Object.values(APPLICATION_STATUS))
        .withMessage("Invalid application status."),
];

module.exports = {
    applyValidation,
    getStartupApplicationsValidation,
    withdrawApplicationValidation,
    reviewApplicationValidation,
    updateStatusValidation
};