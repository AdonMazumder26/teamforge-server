const Startup = require("../startups/startup.model");
const Application = require("../applications/application.model");

const {
    APPLICATION_STATUS,
} = require("../applications/application.constants");

const getDashboard = async (userId) => {
    // Get recruiter's startups
    const startups = await Startup.find({
        founder: userId,
    })
        .sort({ createdAt: -1 })
        .select(
            `
            title
            tagline
            logo
            stage
            isHiring
            createdAt
            updatedAt
        `
        );

    const startupIds = startups.map((startup) => startup._id);

    const totalStartups = startups.length;

    const hiringStartups = startups.filter(
        (startup) => startup.isHiring
    ).length;

    const closedStartups = startups.filter(
        (startup) => !startup.isHiring
    ).length;

    const latestStartup = startups.length > 0 ? startups[0] : null;

    const recentStartups = startups.slice(0, 5);

    const [
        totalApplications,
        pendingApplications,
        screeningApplications,
        shortlistedApplications,
        interviewApplications,
        finalReviewApplications,
        acceptedApplications,
        rejectedApplications,
        withdrawnApplications,
    ] = await Promise.all([
        Application.countDocuments({
            startup: { $in: startupIds },
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.PENDING,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.SCREENING,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.SHORTLISTED,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.INTERVIEW,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.FINAL_REVIEW,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.ACCEPTED,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.REJECTED,
        }),

        Application.countDocuments({
            startup: { $in: startupIds },
            status: APPLICATION_STATUS.WITHDRAWN,
        }),
    ]);

    const averageScoreResult = await Application.aggregate([
        {
            $match: {
                startup: {
                    $in: startupIds,
                },
                "review.score": {
                    $ne: null,
                },
            },
        },
        {
            $group: {
                _id: null,
                averageReviewScore: {
                    $avg: "$review.score",
                },
            },
        },
    ]);

    const averageReviewScore =
        averageScoreResult.length > 0
            ? Number(
                averageScoreResult[0].averageReviewScore.toFixed(2)
            )
            : 0;

    return {
        totalStartups,
        hiringStartups,
        closedStartups,

        totalApplications,
        pendingApplications,
        screeningApplications,
        shortlistedApplications,
        interviewApplications,
        finalReviewApplications,
        acceptedApplications,
        rejectedApplications,
        withdrawnApplications,

        averageReviewScore,

        latestStartup,
        recentStartups,
    };
};

module.exports = {
    getDashboard,
};