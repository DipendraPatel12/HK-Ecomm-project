const { verifyToken } = require("../utilities/jwt");
const { renderError } = require("../utilities/response");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return renderError(res, 401, "Error", "Unauthorized");
    }
    const decodedData = verifyToken(token);
    req.user = decodedData;
    next();
  } catch (error) {
    return renderError(res, 401, "Error", "Internal Server Error");
  }
};

module.exports = authenticateToken;
