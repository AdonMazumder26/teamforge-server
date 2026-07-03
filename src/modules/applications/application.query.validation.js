const { query } = require("express-validator");
const { APPLICATION_STATUS } = require("./application.constants");

const getApplicationsValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100."),

    query("sort")
        .optional()
        .isIn(["newest", "oldest", "status"])
        .withMessage("Invalid sort option."),

    query("status")
        .optional()
        .isIn(Object.values(APPLICATION_STATUS))
        .withMessage("Invalid application status."),
];

module.exports = {
    getApplicationsValidation,
};