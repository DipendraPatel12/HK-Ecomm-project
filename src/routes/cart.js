const express = require("express");
const index = require("../controllers/index");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/", index.cartController.getCart);
router.post("/addToCart", index.cartController.addToCart);
router.post("/remove/:productId", index.cartController.removeFromCart);
router.post("/update/:productId", index.cartController.updateCart);

router.get("/checkout", authenticateToken, index.cartController.checkoutPage);

module.exports = router;
