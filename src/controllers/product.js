const { renderError, renderSuccess } = require("../utilities/response");
const { Product, Category } = require("../models");
const { where } = require("sequelize");

const productDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    return renderSuccess(res, "pages/productDetail", "Product", null, {
      product,
    });
  } catch (error) {
    console.error(`Error While Rendering Product Detail Page : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

const cart = async (req, res) => {
  try {
    const cart = [{}];
    return renderSuccess(res, "pages/cart", "Cart", null, { cart });
  } catch (error) {
    console.error(`Error While Rendering Cart Page : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

const { Op } = require("sequelize");

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 5, categoryId, price, query } = req.query;

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (pageNumber - 1) * pageLimit;

    const where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }


    if (query) {
      where.productName = {
        [Op.like]: `%${query}%`, 
      };
    }

    const order = [];
    if (price === "asc") order.push(["price", "ASC"]);
    if (price === "desc") order.push(["price", "DESC"]);

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: pageLimit,
      offset,
      order,
    });

    const categories = await Category.findAll();

    return renderSuccess(res, "pages/home", "Home", null, {
      totalProducts: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageLimit),
      products: rows,
      categoryId,
      price,
      query,
      categories,
    });
  } catch (error) {
    console.log(error);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

module.exports = { productDetailPage, cart, getProducts };
