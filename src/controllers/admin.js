const { Category } = require("../models/index");
const { renderSuccess, renderError } = require("../utilities/response");

const addProductPage = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return renderSuccess(res, "admin/addProduct", "Add Product",null,{
      categories,
    });
  } catch (error) {
    console.error(`Error While Adding Product : ${error}`);
    return renderError(res, "pages/500", "error", "Internal Server Error");
  }
};

const addCategoryPage = async (req, res) => {
  try {
    return renderSuccess(res, "admin/addCategory", "Add Category");
  } catch (error) {
    console.error(`Error while Showing Set Category Page : ${error}`);
    return renderError(res, "pages/500", "error", "Internal Server Error");
  }
};

const addCategory = async (req, res) => {
  try {
    await Category.create(req.body);
    return res.redirect("/");
  } catch (error) {
    console.error(`Error While Adding Category : ${error}`);
    return renderError(res, "pages/500", "error", "Internal Server Error");
  }
};
const { Product } = require("../models");
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      stock,
      price,
      description,
      category: categoryId,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    await Product.create({
      productName,
      stock,
      price,
      description,
      categoryId,
      image,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(`Error while Adding Product Details in Db : ${error}`);
    return renderError(res, "pages/500", "error", "Internal Server Error");
  }
};
module.exports = { addProductPage, addCategoryPage, addCategory, addProduct };
