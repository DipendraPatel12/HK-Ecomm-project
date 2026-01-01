const admin = require("./admin");
const auth = require("./auth");
const product = require("./product");
const cart = require("./cart");
module.exports = {
  adminController: admin,
  authController: auth,
  productController: product,
  cartController: cart,
};
