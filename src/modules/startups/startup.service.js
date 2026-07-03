const Startup = require("./startup.model");

const {
    buildFilter,
    buildSort,
    buildPagination,
    buildProjection,
} = require("../../utils/startupQueryBuilder");



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
    return await Startup.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    ).populate("founder", "name username profileImage");
};

const deleteStartup = async (id) => {
    return await Startup.findByIdAndDelete(id);
};


module.exports = {
    createStartup, getAllStartups, getStartupById, getStartupForAuthorization, updateStartup, deleteStartup,
};