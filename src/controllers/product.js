const { Op } = require("sequelize");
const { renderError, renderSuccess } = require("../utilities/response");
const { Product, Category, User } = require("../models");
const { where } = require("sequelize");
const adminService = require("../services/admin");
const productDetailPage = async (req, res) => {
  try {
    const { id } = req.params;
    // const product = await Product.findOne({ where: { id } });
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Review,
          include: [
            {
              model: User,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!product) {
      return renderError(res, "pages/404", "Not Found", "Product not found");
    }
    const reviews = product.Reviews || [];
    return renderSuccess(res, "pages/productDetail", "Product", null, {
      product,
      reviews,
    });
  } catch (error) {
    console.error(`Error While Rendering Product Detail Page : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, categoryId, price, query } = req.query;

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

    const categories = await adminService.findAllCategory();

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

const { Review } = require("../models");

const postReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    await Review.create({
      productId,
      userId,
      comment,
    });
    return res.redirect(`/product/detail/${productId}`);
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.redirect(`/product/detail/${productId}`);
  }
};

module.exports = { productDetailPage, getProducts, postReview };
