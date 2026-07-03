const buildPagination = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

const buildSort = (sort) => {
    switch (sort) {
        case "oldest":
            return { createdAt: 1 };

        case "status":
            return { status: 1 };

        default:
            return { createdAt: -1 };
    }
};

const buildFilter = (query) => {
    const filter = {};

    if (query.status) {
        filter.status = query.status;
    }

    return filter;
};

module.exports = {
    buildPagination,
    buildSort,
    buildFilter,
};