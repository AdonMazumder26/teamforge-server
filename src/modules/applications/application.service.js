const Application = require("./application.model");
const Startup = require("../startups/startup.model");
const { uploadFile } = require("../../utils/cloudinaryUpload");


const {
    APPLICATION_STATUS,
} = require("./application.constants");

const {
    buildFilter,
    buildPagination,
    buildSort,
} = require("../../utils/applicationQueryBuilder");

const applyToStartup = async (applicationData, applicantId, file) => {
    const startup = await Startup.findById(applicationData.startupId);

    if (!startup) {
        const error = new Error("Startup not found.");
        error.statusCode = 404;
        throw error;
    }

    if (!startup.isHiring) {
        const error = new Error(
            "This startup is not accepting applications."
        );

        error.statusCode = 400;

        throw error;
    }

    if (startup.founder.toString() === applicantId.toString()) {
        const error = new Error(
            "You cannot apply to your own startup."
        );

        error.statusCode = 403;

        throw error;
    }

    const roleExists = startup.rolesNeeded.includes(
        applicationData.role
    );

    if (!roleExists) {
        const error = new Error(
            "Selected role is not available."
        );

        error.statusCode = 400;

        throw error;
    }

    const existingApplication = await Application.findOne({
        applicant: applicantId,
        startup: startup._id,
    });

    if (existingApplication) {
        const error = new Error(
            "You have already applied to this startup."
        );

        error.statusCode = 409;

        throw error;
    }

    let resume = {
        url: "",
        publicId: "",
    };

    if (file) {

        const uploadedResume = await uploadFile(
            file,
            "teamforge/resumes",
            "raw"
        );



        resume = {
            url: uploadedResume.secure_url,
            publicId: uploadedResume.public_id,
        };
    }



    const application = await Application.create({
        applicant: applicantId,
        startup: startup._id,
        role: applicationData.role,
        message: applicationData.message,
        resume,
        portfolio: applicationData.portfolio,
    });



    const populatedApplication = await Application.findById(application._id)
        .populate(
            "applicant",
            "name username profileImage"
        )
        .populate(
            "startup",
            "title logo"
        );



    return populatedApplication;
};


const getMyApplications = async (userId, query) => {
    const filter = {
        applicant: userId,
        ...buildFilter(query),
    };

    const { page, limit, skip } = buildPagination(query);

    const sort = buildSort(query.sort);

    const applications = await Application.find(filter)
        .populate(
            "startup",
            "title tagline logo location stage"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalApplications =
        await Application.countDocuments(filter);

    return {
        applications,

        pagination: {
            currentPage: page,

            totalPages: Math.ceil(totalApplications / limit),

            totalResults: totalApplications,

            limit,
        },
    };
};

const getStartupApplications = async (
    startupId,
    founderId,
    query
) => {
    const startup = await Startup.findById(startupId);

    if (!startup) {
        const error = new Error("Startup not found.");
        error.statusCode = 404;
        throw error;
    }

    if (startup.founder.toString() !== founderId.toString()) {
        const error = new Error(
            "You are not authorized to view these applications."
        );

        error.statusCode = 403;
        throw error;
    }

    const filter = {
        startup: startupId,
        ...buildFilter(query),
    };

    const { page, limit, skip } =
        buildPagination(query);

    const sort = buildSort(query.sort);

    const applications = await Application.find(filter)
        .populate(
            "applicant",
            `
            name
            username
            profileImage
            bio
            skills
            github
            linkedin
            portfolio
            location
            `
        )
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalApplications =
        await Application.countDocuments(filter);

    return {
        startup: {
            id: startup._id,
            title: startup.title,
        },

        applications,

        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalApplications / limit),
            totalResults: totalApplications,
            limit,
        },
    };
};

const withdrawApplication = async (
    applicationId,
    applicantId
) => {
    const application = await Application.findById(
        applicationId
    );

    if (!application) {
        const error = new Error("Application not found.");
        error.statusCode = 404;
        throw error;
    }

    if (
        application.applicant.toString() !==
        applicantId.toString()
    ) {
        const error = new Error(
            "You are not authorized to withdraw this application."
        );

        error.statusCode = 403;
        throw error;
    }

    if (
        application.status ===
        APPLICATION_STATUS.WITHDRAWN
    ) {
        const error = new Error(
            "Application has already been withdrawn."
        );

        error.statusCode = 400;
        throw error;
    }

    if (
        application.status ===
        APPLICATION_STATUS.ACCEPTED
    ) {
        const error = new Error(
            "Accepted applications cannot be withdrawn."
        );

        error.statusCode = 400;
        throw error;
    }

    application.status =
        APPLICATION_STATUS.WITHDRAWN;

    await application.save();

    return await Application.findById(
        application._id
    )
        .populate(
            "startup",
            `
    title
    tagline
    logo
    location
    stage
    `
        )
        .populate(
            "applicant",
            "name username profileImage"
        );
};

const getApplicationById = async (applicationId, recruiterId) => {
    const application = await Application.findById(applicationId)
        .populate(
            "applicant",
            `
            name
            username
            profileImage
            bio
            skills
            github
            linkedin
            portfolio
            location
            role
            `
        )
        .populate(
            "startup",
            `
            title
            founder
            logo
            `
        );

    if (!application) {
        const error = new Error("Application not found.");
        error.statusCode = 404;
        throw error;
    }

    if (
        application.startup.founder.toString() !==
        recruiterId.toString()
    ) {
        const error = new Error("Unauthorized.");
        error.statusCode = 403;
        throw error;
    }

    return application;
};

module.exports = {
    applyToStartup, getMyApplications, getStartupApplications, withdrawApplication, getApplicationById
};