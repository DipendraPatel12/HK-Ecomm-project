const express = require("express");
const index = require("../controllers/index");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/", authenticateToken, index.cartController.getCart);
router.post("/addToCart", authenticateToken, index.cartController.addToCart);
router.post(
  "/remove/:productId",
  authenticateToken,
  index.cartController.removeFromCart
);
router.post(
  "/update/:productId",
  authenticateToken,
  index.cartController.updateCart
);

router.get("/checkout", authenticateToken, index.cartController.checkoutPage);
router.post(
  "/api/checkout",
  authenticateToken,
  index.cartController.cartCheckout
);
module.exports = router;
