const { verifyToken } = require("../utilities/jwt");
const { jsonError } = require("../utilities/response");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return jsonError(res, 401, "Unauthorized");
    }
    const decodedData = verifyToken(token);
    req.user = decodedData;
    next();
  } catch (error) {
    return jsonError(res, 500, "Internal Server Error");
  }
};

module.exports = authenticateToken;
