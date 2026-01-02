const { verifyToken } = require("../utilities/jwt");
const { CartItem } = require("../models");

const attachUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    res.locals.user = null;
    res.locals.counts = 0;
    res.locals.query = req.query.query || "";

    if (token) {
      const decodedData = verifyToken(token);
      req.user = decodedData;
      res.locals.user = decodedData;

      const userId = decodedData.id;

      const distinctCount = await CartItem.count({
        where: { userId },
      });

      res.locals.counts = distinctCount || 0;
    } else {
      const sessionCart = req.session?.cart || {};

      res.locals.counts = Object.keys(sessionCart).length;
    }

    next();
  } catch (error) {
    console.error("attachUser error:", error);
    res.locals.user = null;
    res.locals.counts = 0;
    next();
  }
};

module.exports = attachUser;
