const express = require("express");
const router = express.Router();
const index = require("../controllers/index");
router.get("/products", index.productController.getProducts);
router.get("/detail/:id", index.productController.productDetailPage);
router.post("/:productId/review", index.productController.postReview);
module.exports = router;
