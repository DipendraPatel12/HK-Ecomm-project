const express = require("express");

const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../utilities/validateBody");
const { register, login, logout } = require("../controllers/auth");
const router = express.Router();
const { renderSuccess } = require("../utilities/response");
const index = require("../controllers/index");

router.get("/", index.productController.getProducts);

router.get("/login", (req, res) => {
  return renderSuccess(res, "auth/login", "login", null, { error: null });
});

router.get("/register", (req, res) => {
  return renderSuccess(res, "auth/register", "Register", null, { error: null });
});

router.post("/api/auth/register", validate(signupSchema), register);
router.post("/api/auth/login", validate(loginSchema), login);
router.post("/api/auth/logout", logout);

module.exports = router;
