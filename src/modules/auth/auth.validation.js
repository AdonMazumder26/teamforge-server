const { body } = require("express-validator");

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

    body("role")
        .isIn([
            "Founder",
            "Co-Founder",
            "Full Stack Developer",
            "Frontend Developer",
            "Backend Developer",
            "Mobile Developer",
            "AI/ML Engineer",
            "DevOps Engineer",
            "UI/UX Designer",
            "Graphic Designer",
            "Product Manager",
            "Business Developer",
            "Digital Marketer",
            "Content Creator",
            "Sales",
            "Investor",
            "Mentor",
            "Advisor",
            "Student",
            "Other"
        ])
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