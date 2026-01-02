const { Product } = require("../models");

const findProductById = async (productId) => {
  try {
    return await Product.findByPk(productId);
  } catch (error) {
    console.error(`Error While finding Product By Id : ${error}`);
    throw error;
  }
};

module.exports = { findProductById };
