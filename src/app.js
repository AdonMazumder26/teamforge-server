const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");
const compression = require("compression");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const startupRoutes = require("./modules/startups/startup.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const applicationRoutes = require("./modules/applications/application.routes");



const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))



app.use(express.json({
    limit: "10kb",
}));
app.use(cookieParser());
app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);
app.use(morgan("dev"));
app.use(hpp());
app.use(compression());
app.disable("x-powered-by");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);




module.exports = app;
