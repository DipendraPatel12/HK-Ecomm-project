const { jsonError } = require("../utilities/response");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return jsonError(res, 400, error.details[0].message);
    }
    next();
  };
};

module.exports = validate;
