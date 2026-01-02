const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();
const index = require("../controllers/index");
router.get(
  "/orders/:orderId",
  authenticateToken,
  index.cartController.orderDetailPage
);
router.post("/create-payment", index.cartController.createPayment);
router.get("/payment/success", index.cartController.paymentSuccessPage);
router.get("/payment/cancel", index.cartController.paymentFailed);
module.exports = router;
