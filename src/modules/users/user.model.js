const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: [
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
            ],
            required: true,
        },

        bio: {
            type: String,
            default: "",
        },

        skills: {
            type: [String],
            default: [],
        },

        profileImage: {
            type: String,
            default: "",
        },

        github: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        portfolio: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);