const express = require("express");
const { register, login, me, logout } = require("./auth.controller");
const { registerValidation, loginValidation } = require("./auth.validation");
const protect = require("../../middleware/auth.middleware");
const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", protect, me);
router.post("/logout", logout);

module.exports = router;