const mongoose = require("mongoose");

const Application = require("./application.model");
const {
    STATUS_TRANSITIONS,
} = require("./application.constants");

const updateApplicationStatus = async (
    applicationId,
    recruiterId,
    newStatus
) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error("Invalid application ID.");
    }

    const application = await Application.findById(applicationId)
        .populate("startup")
        .populate("applicant", "-password");

    if (!application) {
        throw new Error("Application not found.");
    }

    if (
        application.startup.founder.toString() !== recruiterId.toString()
    ) {
        throw new Error(
            "You are not authorized to update this application."
        );
    }

    const currentStatus = application.status;

    const allowedTransitions =
        STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
        throw new Error(
            `Cannot change status from "${currentStatus}" to "${newStatus}".`
        );
    }

    application.status = newStatus;

    await application.save();

    return await Application.findById(application._id)
        .populate("applicant", "-password")
        .populate("startup")
        .populate("review.reviewedBy", "name username profileImage");
};

module.exports = {
    updateApplicationStatus,
};