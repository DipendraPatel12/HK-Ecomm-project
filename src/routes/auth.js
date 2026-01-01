const express = require("express");

const validate = require("../middlewares/validate");
const { signupSchema, loginSchema } = require("../utilities/validateBody");
const { register, login, logout } = require("../controllers/auth");
const router = express.Router();
const { Product, Category } = require("../models");
const { renderSuccess } = require("../utilities/response");
const index = require("../controllers/index");
// router.get("/", async (req, res) => {
//   const products = await Product.findAll();
//   const categories = await Category.findAll();
//   // return res.render("pages/home", { title: "Home", products });
//   return renderSuccess(res, "pages/home", "Ecom", null, {
//     products,
//     categories,
//   });
// });
router.get("/", index.productController.getProducts);

router.get("/login", (req, res) => {
  return res.render("auth/login", {
    error: null,
    title: "Login",
  });
});

router.get("/register", (req, res) => {
  return res.render("auth/register", {
    error: null,
    success: null,
    title: "Register",
  });
});

router.post("/api/auth/register", validate(signupSchema), register);
router.post("/api/auth/login", validate(loginSchema), login);
router.post("/api/auth/logout", logout);

module.exports = router;
