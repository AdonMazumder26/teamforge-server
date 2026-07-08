const startupService = require("../modules/startups/startup.service");

const startupOwnerMiddleware = async (req, res, next) => {
    try {
        const startup = await startupService.getStartupForAuthorization(
            req.params.id
        );

        if (!startup) {
            return res.status(404).json({
                success: false,
                message: "Startup not found",
            });
        }

        if (startup.founder.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action.",
            });
        }

        req.startup = startup;

        next();
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid startup ID",
            });
        }



        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = startupOwnerMiddleware;