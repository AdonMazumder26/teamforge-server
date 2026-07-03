const router = require("express").Router();

const protect = require("../../middleware/auth.middleware");

const {
    getDashboard,
} = require("./dashboard.controller");

router.get(
    "/",
    protect,
    getDashboard
);

module.exports = router;