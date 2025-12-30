const express = require("express");

const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../utilities/validateBody");
const { register, login } = require("../controllers/auth");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("pages/home", { title: "Home" });
});

router.get("/login", (req, res) => {
  return res.render("auth/login", {
    layout: false,
    error: null,
    title: "Login",
  });
});

router.get("/register", (req, res) => {
  return res.render("auth/register", {
    layout: false,
    error: null,
    success: null,
    title: "Register",
  });
});

router.post("/api/auth/register", validate(signupSchema), register);
router.post("/api/auth/login", validate(loginSchema), login);

module.exports = router;
