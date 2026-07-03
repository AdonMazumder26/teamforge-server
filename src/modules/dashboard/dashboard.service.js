const Startup = require("../startups/startup.model");

const getDashboard = async (userId) => {


    const totalStartups =
        await Startup.countDocuments({
            founder: userId,
        });


    const hiringStartups =
        await Startup.countDocuments({
            founder: userId,
            isHiring: true,
        });


    const closedStartups =
        await Startup.countDocuments({
            founder: userId,
            isHiring: false,
        });


    const latestStartup =
        await Startup.findOne({
            founder: userId,
        })
            .sort({
                createdAt: -1,
            });


    const recentStartups =
        await Startup.find({
            founder: userId,
        })
            .sort({
                createdAt: -1,
            })
            .limit(5);

    return {

        totalStartups,

        hiringStartups,

        closedStartups,

        latestStartup,

        recentStartups,

    };
};

module.exports = { getDashboard };