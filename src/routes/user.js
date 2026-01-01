const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();
const index = require("../controllers/index");
router.get(
  "/orders/:orderId",
  authenticateToken,
  index.cartController.orderDetailPage
);

module.exports = router;
