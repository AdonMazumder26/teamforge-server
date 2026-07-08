const mongoose = require("mongoose");

const Application = require("./application.model");

const reviewApplication = async (
    applicationId,
    reviewerId,
    reviewData
) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error("Invalid application ID.");
    }

    const application = await Application.findById(applicationId)
        .populate("startup");

    if (!application) {
        throw new Error("Application not found.");
    }

    if (
        application.startup.founder.toString() !== reviewerId.toString()
    ) {
        throw new Error("You are not authorized to review this application.");
    }

    application.review = {
        ...reviewData,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
    };

    await application.save();

    return Application.findById(application._id)
        .populate("applicant", "-password")
        .populate("startup")
        .populate("review.reviewedBy", "name username profileImage");
};

module.exports = {
    reviewApplication,
};