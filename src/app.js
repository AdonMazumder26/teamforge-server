const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

module.exports = app;
