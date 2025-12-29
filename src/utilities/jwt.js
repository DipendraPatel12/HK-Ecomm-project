require("dotenv").config({ quiet: true });
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const generateAccessToken = (user) => {
  try {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Error While Generating Access Token : ", error);
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Error While Verifying Access Token :", error);
    throw error;
  }
};

module.exports = { verifyToken, generateAccessToken };
