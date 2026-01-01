const { verifyToken } = require("../utilities/jwt");
const { renderError } = require("../utilities/response");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.locals.user = null;
      return renderError(
        res,
        "pages/401",
        "Error",
        "You are not authorized to access this page.login first!"
      );
    }
    const decodedData = verifyToken(token);
    req.user = decodedData;
    res.locals.user = decodedData;
    next();
  } catch (error) {
    console.error(`Error while Verifying Token : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

module.exports = authenticateToken;
