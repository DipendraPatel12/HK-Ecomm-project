const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const findUser = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    console.error(`Error While finding User In Database : ${error}`);
    throw error;
  }
};

const createUser = async (name, email, password) => {
  try {
    return await User.create({ name, email, password });
  } catch (error) {
    console.error(`Error While Adding User Details In Database : ${error}`);
    throw error;
  }
};

const hashedPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error(`Error While Hashing Password :${error}`);
    throw error;
  }
};

const matchPassword = async (password, userPassword) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    console.error(`Error While Comparing the Passwords : ${error}`);
    throw error;
  }
};

const { CartItem } = require("../models");
const mergeGuestCartToUserCart = async (req, userId) => {
  const sessionCart = req.session?.cart;

  if (!sessionCart) return;

  for (const productId in sessionCart) {
    const quantity = sessionCart[productId];

    const existingItem = await CartItem.findOne({
      where: { userId, productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        userId,
        productId,
        quantity,
      });
    }
  }

  req.session.cart = {};
};

module.exports = {
  findUser,
  createUser,
  hashedPassword,
  matchPassword,
  mergeGuestCartToUserCart,
};
