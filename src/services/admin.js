const { Product, Category } = require("../models");
const productAdd = async (body) => {
  try {
    return await Product.create(body);
  } catch (error) {
    console.error(`Error While Adding Product in Db : ${error}`);
    throw error;
  }
};

const createCategory = async (body) => {
  try {
    await Category.create(body);
  } catch (error) {
    console.error(`Error While Creating in Db : ${error}`);
    throw error;
  }
};
const findAllCategory = async () => {
  try {
    return await Category.findAll();
  } catch (error) {
    console.error(`Error While finding All Category in Db : ${error}`);
    throw error;
  }
};
module.exports = {
  productAdd,
  createCategory,
  findAllCategory,
};
