const stripe = require("../config/strip");
const { CartItem, Product, Order, OrderItem } = require("../models");
const { renderSuccess, renderError } = require("../utilities/response");
const productService = require("../services/product");
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity) || 1;
    const product = await productService.findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    if (req.user) {
      const userId = req.user.id;

      const cartItem = await CartItem.findOne({
        where: { userId, productId },
      });

      if (cartItem) {
        cartItem.quantity += qty;
        await cartItem.save();
      } else {
        await CartItem.create({
          userId,
          productId,
          quantity: qty,
        });
      }
    } else {
      req.session = req.session || {};
      req.session.cart = req.session.cart || {};

      req.session.cart[productId] = (req.session.cart[productId] || 0) + qty;
    }

    return res.status(200).json({
      message: "Product added to cart",
    });
  } catch (error) {
    console.log("Add to cart error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    let cart = [];
    if (req.user) {
      const userId = req.user.id;
      cart = await CartItem.findAll({
        where: { userId },
        include: ["Product"],
      });
    } else {
      const productIds = Object.keys(req.session.cart || {});
      cart = await Product.findAll({ where: { id: productIds } });

      cart = cart.map((product) => ({
        Product: product,
        quantity: req.session.cart[product.id],
      }));
    }

    // console.log("CART", cart);
    return renderSuccess(res, "pages/cart", "Cart", "null", { cart });
  } catch (error) {
    console.error(`Error While Getting Cart Data : ${error}`);
    return renderError(res, "pages/500", "Cart Error", "Internal Server Error");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (req.user) {
      
      const userId = req.user.id;

      const cartItem = await CartItem.findOne({
        where: { userId, productId },
      });

      if (cartItem) {
        await cartItem.destroy();
      }
    } else {
    
      if (req.session?.cart && req.session.cart[productId]) {
        delete req.session.cart[productId];
      }
    }

    return res.redirect("/cart");
  } catch (error) {
    console.log("Remove from cart error:", error);
    return res.redirect("/cart");
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.redirect("/cart");
    }

  
    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) {
      return res.redirect("/cart");
    }

    if (req.user) {
      
      const userId = req.user.id;

      const cartItem = await CartItem.findOne({
        where: { userId, productId },
      });

      if (cartItem) {
        cartItem.quantity = quantity;
        await cartItem.save();
      }
    } else {
  
      req.session = req.session || {};
      req.session.cart = req.session.cart || {};

      if (req.session.cart[productId]) {
        req.session.cart[productId] = quantity;
      }
    }

    return res.redirect("/cart");
  } catch (error) {
    console.log("Error While Updating Cart :", error);
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

const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: Product,
    });

    if (!cartItems.length) return res.redirect("/cart");

    let totalAmount = 0;
    const lineItems = cartItems.map((item) => {
      totalAmount += item.Product.price * item.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.Product.productName,
          },
          unit_amount: Math.round(item.Product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      userId,
      totalAmount,
      status: "pending",
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
    }

    const customer = await stripe.customers.create({
      name: "Test Customer",
      address: {
        line1: "Test Street",
        city: "Test City",
        state: "Test State",
        postal_code: "000000",
        country: "US",
      },
    });
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/user/payment/success?orderId=${order.id}`,
      cancel_url: `${req.protocol}://${req.get(
        "host"
      )}/user/payment/cancel?orderId=${order.id}`,
    });

    await order.update({ paymentIntentId: session.id });

    res.redirect(session.url);
  } catch (error) {
    console.error(`Error While product's Payments : ${error}`);
    return renderError(
      res,
      "pages/500",
      "Payment Failed",
      "Internal Server Error"
    );
  }
};

const paymentSuccessPage = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Order.findByPk(orderId, {
      include: OrderItem,
    });

    if (!order) return res.redirect("/");

    await order.update({ status: "paid" });

    await CartItem.destroy({
      where: { userId: order.userId },
    });

    return renderSuccess(res, "pages/paymentSuccess", "Payment Success", null, {
      order,
    });
  } catch (error) {
    console.error(`Error While Showing Payment Success Page : ${error}`);
    return renderError(res, "pages/500", "Payments", "Internal Server Error");
  }
};

const paymentFailed = async (req, res) => {
  try {
    const { orderId } = req.query;

    await Order.update({ status: "cancelled" }, { where: { id: orderId } });

    res.render("payment-cancel");
  } catch (error) {
    console.error(`Error While Rendering Payment Failed Page : ${error}`);
    return renderError(
      res,
      "pages/500",
      "Payment Failed",
      "Internal Server Error"
    );
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  checkoutPage,
  orderDetailPage,
  createPayment,
  paymentSuccessPage,
  paymentFailed,
};
