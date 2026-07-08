const Startup = require("./startup.model");
const { uploadFile, deleteFile } = require("../../utils/cloudinaryUpload");

const {
    buildFilter,
    buildSort,
    buildPagination,
    buildProjection,
} = require("../../utils/startupQueryBuilder");

const Application = require("../applications/application.model");


const createStartup = async (startupData) => {

    const existingStartup = await Startup.findOne({
        title: startupData.title,
        founder: startupData.founder,
    });

    if (existingStartup) {
        throw new Error("You already have a startup with this title.");
    }
    return await Startup.create(startupData);
};

const getAllStartups = async (queryParams) => {

    const filter = buildFilter(queryParams);

    const sort = buildSort(queryParams.sort);

    const projection = buildProjection(queryParams.fields);

    const {
        pageNumber,
        limitNumber,
        skip,
    } = buildPagination(
        queryParams.page,
        queryParams.limit
    );

    const totalStartups =
        await Startup.countDocuments(filter);

    const startups = await Startup.find(filter)
        .select(projection)
        .populate(
            "founder",
            "name username profileImage"
        )
        .sort(sort)
        .skip(skip)
        .limit(limitNumber);

    return {
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(
                totalStartups /
                limitNumber
            ),
            totalResults: totalStartups,
            limit: limitNumber,
        },
        startups,
    };
};

const getStartupById = async (id) => {
    return await Startup.findById(id).populate(
        "founder",
        "name username profileImage bio skills github linkedin portfolio location"
    );
};

const getStartupForAuthorization = async (id) => {
    return await Startup.findById(id);
};

const updateStartup = async (id, updateData) => {
    const startup = await Startup.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    ).populate("founder", "name username profileImage");

    if (!startup) {
        throw new Error("Startup not found.");
    }

    return startup;
};

const deleteStartup = async (id) => {
    return await Startup.findByIdAndDelete(id);
};


const uploadStartupLogo = async (startupId, userId, file) => {
    const startup = await Startup.findById(startupId);

    if (!startup) {
        const error = new Error("Startup not found.");
        error.statusCode = 404;
        throw error;
    }

    if (startup.founder.toString() !== userId.toString()) {
        const error = new Error(
            "You are not authorized to update this startup."
        );
        error.statusCode = 403;
        throw error;
    }

    // Delete old logo
    if (startup.logo?.publicId) {
        await deleteFile(startup.logo.publicId);
    }

    // Upload new logo
    const result = await uploadFile(
        file,
        "teamforge/startups",
        "image"
    );

    startup.logo = {
        url: result.secure_url,
        publicId: result.public_id,
    };

    await startup.save();

    return await Startup.findById(startupId).populate(
        "founder",
        `
    name
    username
    profileImage
    `
    );
};

const getMyStartups = async (founderId) => {

    const startups = await Startup.find({
        founder: founderId,
    })
        .select(
            `
            title
            tagline
            logo
            stage
            location
            technologies
            rolesNeeded
            isHiring
            createdAt
            updatedAt
            founder
            `
        )
        .populate(
            "founder",
            "name username profileImage"
        )
        .sort({
            createdAt: -1,
        });

    const startupIds = startups.map(
        (startup) => startup._id
    );

    const applicationCounts = await Application.aggregate([
        {
            $match: {
                startup: {
                    $in: startupIds,
                },
            },
        },
        {
            $group: {
                _id: "$startup",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    const countMap = new Map(
        applicationCounts.map((item) => [
            item._id.toString(),
            item.count,
        ])
    );

    return startups.map((startup) => ({
        ...startup.toObject(),
        applicationCount:
            countMap.get(startup._id.toString()) || 0,
    }));
};


module.exports = {
    createStartup, getAllStartups, getStartupById, getStartupForAuthorization, updateStartup, deleteStartup, uploadStartupLogo, getMyStartups
};