const express = require("express");

const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../utilities/validateBody");
const { register, login } = require("../controllers/auth");
const router = express.Router();

router.post("/register", validate(signupSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
