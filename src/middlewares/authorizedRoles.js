const { renderError } = require("../utilities/response");

const authorizedRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return renderError(res, "pages/401", "Login Error", "Please login first");
    }

    if (!roles.includes(req.user.role)) {
      return renderError(res, "pages/403", "Login Error", "Access denied");
    }

    next();
  };
};

module.exports = authorizedRoles;
