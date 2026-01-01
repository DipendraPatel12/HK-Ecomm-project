const { CartItem, Product, Order, OrderItem } = require("../models");
const { renderSuccess, renderError } = require("../utilities/response");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cartItem = await CartItem.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await CartItem.create({
        userId,
        productId,
        quantity,
      });
    }

    return res.status(200).json({
      message: "Product added to cart",
    });
  } catch (error) {
    console.log("Add to cart error:", error);
    return res.status(500).json({ message: " Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await CartItem.findAll({
    where: { userId },
    include: ["Product"],
  });

  // console.log("CART", cart);
  return renderSuccess(res, "pages/cart", "Cart", "null", { cart });
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cartItem.destroy();

    return res.redirect("/cart");
  } catch (error) {
    console.log("Remove from cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.redirect("/cart");
    }

    const cartItem = await CartItem.findOne({
      where: { userId, productId },
      include: Product,
    });

    if (!cartItem) {
      return res.redirect("/cart");
    }

    if (cartItem.Product.stock < quantity) {
      return res.redirect("/cart");
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.redirect("/cart");
  } catch (error) {
    console.log("Cart update error:", error);
    return res.redirect("/cart");
  }
};

const checkoutPage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.redirect("/login");
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: Product,
    });

    if (cartItems.length === 0) {
      return res.redirect("/cart");
    }

    let total = 0;
    cartItems.forEach((item) => {
      total += item.Product.price * item.quantity;
    });

    return renderSuccess(res, "pages/checkout", "Checkout", null, {
      cartItems,
      total,
    });
  } catch (error) {
    console.error(`Error while Showing Checkout Page : ${error}`);
    return renderError(res, "pages/500", "Checkout", "Internal Server Error");
  }
};

const cartCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: Product,
    });

    if (!cartItems.length) return res.redirect("/cart");

    let total = 0;
    cartItems.forEach((item) => {
      total += item.Product.price * item.quantity;
    });

    const order = await Order.create({
      userId,
      totalAmount: total,
    });

    for (let item of cartItems) {
      if (item.Product.stock < item.quantity) {
        return res.send(`Not enough stock for ${item.Product.productName}`);
      }

      await OrderItem.create({
        orderId: order.id,
        productId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price,
      });

      await item.Product.update({
        stock: item.Product.stock - item.quantity,
      });
    }

    await CartItem.destroy({ where: { userId } });

    res.redirect(`/user/orders/${order.id}`);
  } catch (error) {
    console.error(`Error while Creating Order : ${error} `);
    return renderError(
      res,
      "pages/500",
      "Order Failed",
      "Internal Server Error"
    );
  }
};
const orderDetailPage = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: OrderItem,
          include: Product,
        },
      ],
    });

    return renderSuccess(res, "pages/orderDetail", "Order", null, { order });
  } catch (error) {
    console.error(`Error while Showing Order Details : ${error} `);
    return renderError(res, "pages/500", "Orders", "Internal Server Error");
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  checkoutPage,
  cartCheckout,
  orderDetailPage,
};
