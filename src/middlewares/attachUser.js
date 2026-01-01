
const { verifyToken } = require("../utilities/jwt");

const attachUser = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decodedData = verifyToken(token);
    req.user = decodedData;
    res.locals.user = decodedData;
    next();
  } catch (error) {
    res.locals.user = null;
    next();
  }
};

module.exports = attachUser;
