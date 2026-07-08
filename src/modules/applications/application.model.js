const mongoose = require("mongoose");
const { APPLICATION_STATUS } = require("./application.constants");

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        startup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Startup",
            required: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        resume: {
            _id: false,
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        portfolio: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(APPLICATION_STATUS),
            default: APPLICATION_STATUS.PENDING,
        },

        review: {
            score: {
                type: Number,
                min: 0,
                max: 100,
            },

            recommendation: {
                type: String,
                enum: ["Reject", "Review", "Shortlist", "Strong Hire"],
            },

            strengths: {
                type: [String],
                default: [],
            },

            weaknesses: {
                type: [String],
                default: [],
            },

            interviewNotes: {
                type: String,
                trim: true,
            },

            feedback: {
                type: String,
                trim: true,
            },

            matchedCriteria: {
                type: [String],
                default: [],
            },

            missingCriteria: {
                type: [String],
                default: [],
            },

            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            reviewedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index(
    {
        applicant: 1,
        startup: 1,
    },
    {
        unique: true,
    }
);

applicationSchema.index({
    startup: 1,
    status: 1,
});

applicationSchema.index({
    applicant: 1,
    createdAt: -1,
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;