const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        tagline: {
            type: String,
            trim: true,
            default: "",
        },

        description: {
            type: String,
            required: true,
        },

        founder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],

        rolesNeeded: [
            {
                type: String,
                trim: true,
            },
        ],

        stage: {
            type: String,
            enum: [
                "Idea",
                "MVP",
                "Prototype",
                "Launched",
                "Scaling",
            ],
            default: "Idea",
        },

        location: {
            type: String,
            default: "Remote",
        },

        website: {
            type: String,
            default: "",
        },

        logo: {
            type: String,
            default: "",
        },

        isHiring: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Startup", startupSchema);