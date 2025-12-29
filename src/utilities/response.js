const jsonSuccess = (res, status = 200, message, data = null) => {
  return res.status(status).json({ message, data });
};

const jsonError = (res, status = 500, message, data = null) => {
  return res.status(status).json({ message, data });
};

const renderSuccess = (res, view, title, data = {}) => {
  return res.render(view, { title, ...data });
};

const renderError = (res, view, title, data = {}) => {
  return res.render(view, { title, ...data });
};

module.exports = { jsonSuccess, jsonError, renderError, renderSuccess };
