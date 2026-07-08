const { body } = require("express-validator");
const {
    ACCOUNT_TYPES,
    USER_ROLES,
} = require("../../constants/user.constants");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("accountType")
        .isIn(Object.values(ACCOUNT_TYPES))
        .withMessage("Invalid account type"),

    body("role")
        .isIn(USER_ROLES)
        .withMessage("Invalid role"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
]

module.exports = {
    registerValidation, loginValidation,
};