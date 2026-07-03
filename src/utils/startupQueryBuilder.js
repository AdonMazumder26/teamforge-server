const buildFilter = (query) => {
    const {
        search,
        technology,
        role,
        stage,
        location,
        isHiring,
    } = query;

    const filter = {};

    // Text Search
    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                tagline: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    // Multiple Technologies
    if (technology) {
        const technologies = technology
            .split(",")
            .map((tech) => tech.trim());

        filter.technologies = {
            $in: technologies.map(
                (tech) => new RegExp(tech, "i")
            ),
        };
    }

    // Multiple Roles
    if (role) {
        const roles = role
            .split(",")
            .map((role) => role.trim());

        filter.rolesNeeded = {
            $in: roles.map(
                (role) => new RegExp(role, "i")
            ),
        };
    }

    if (stage) {
        filter.stage = stage;
    }

    if (location) {
        filter.location = {
            $regex: location,
            $options: "i",
        };
    }

    if (isHiring !== undefined) {
        filter.isHiring = isHiring === "true";
    }

    return filter;
};

const buildSort = (sort = "newest") => {
    switch (sort) {
        case "oldest":
            return { createdAt: 1 };

        case "title":
            return { title: 1 };

        default:
            return { createdAt: -1 };
    }
};

const buildPagination = (
    page = 1,
    limit = 10
) => {
    const pageNumber = Math.max(
        Number(page) || 1,
        1
    );

    const limitNumber = Math.max(
        Number(limit) || 10,
        1
    );

    return {
        pageNumber,
        limitNumber,
        skip:
            (pageNumber - 1) *
            limitNumber,
    };
};

const buildProjection = (fields) => {
    const allowedFields = [
        "title",
        "tagline",
        "description",
        "technologies",
        "rolesNeeded",
        "stage",
        "location",
        "website",
        "logo",
        "isHiring",
        "createdAt",
    ];

    if (!fields) return "";

    return fields
        .split(",")
        .filter((field) =>
            allowedFields.includes(field)
        )
        .join(" ");
};

module.exports = {
    buildFilter,
    buildSort,
    buildPagination,
    buildProjection,
};