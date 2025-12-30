const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
const upload = require("../middlewares/multer");
const authorizedRoles = require("../middlewares/authorizedRoles");
const authenticateToken = require("../middlewares/authenticateToken");

router.get(
  "/add-product",
  authenticateToken,
  authorizedRoles(["admin"]),
  index.adminController.addProductPage
);
router.get(
  "/add-category",
  authenticateToken,
  authorizedRoles(["admin"]),
  index.adminController.addCategoryPage
);

router.post(
  "/api/add-category",
  authenticateToken,
  authorizedRoles(["admin"]),
  index.adminController.addCategory
);

router.post(
  "/api/add-product",
  authenticateToken,
  authorizedRoles(["admin"]),
  upload.single("image"),
  index.adminController.addProduct
);

module.exports = router;
