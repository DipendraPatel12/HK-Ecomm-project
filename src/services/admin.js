const { Product } = require("../models");
const productAdd = async (body) => {
  try {
    return await Product.create(body);
  } catch (error) {
    console.error(`Error While Adding Product in Db : ${error}`);
    throw error;
  }
};

module.exports = {
  productAdd,
};
