const express = require("express");
const productDetailPage = require("../controllers/product");
const router = express.Router();
const index = require("../controllers/index");
router.get("/products", index.productController.getProducts);
router.get("/detail/:id", index.productController.productDetailPage);
router.get("/cart", index.productController.cart);

module.exports = router;
