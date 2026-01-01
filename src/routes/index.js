const admin = require("./admin");
const auth = require("./auth");
const product = require("./product");
const cart = require("./cart");
const user = require("./user");
module.exports = {
  adminRoutes: admin,
  authRoutes: auth,
  productRoutes: product,
  cartRoutes: cart,
  userRoutes: user,
};
