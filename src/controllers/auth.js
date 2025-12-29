const bcrypt = require("bcrypt");

const { jsonSuccess, jsonError } = require("../utilities/response");
const user_service = require("../services/user");
const { generateAccessToken } = require("../utilities/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await user_service.findUser(email);

    if (userExists) {
      return jsonError(res, 409, "Email Already Exists");
    }
    const hashedPassword = await user_service.hashedPassword(password);

    await user_service.createUser(name, email, hashedPassword);

    return jsonSuccess(res, 200, "User Registered Successfully");
  } catch (error) {
    console.error(`Error while Register User : ${error}`);
    jsonError(res, 500, "Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await user_service.findUser(email);

    if (!userExists) {
      return jsonError(res, 404, "Email Not Found");
    }
    const isPasswordMatched = await user_service.matchPassword(
      password,
      userExists.password
    );

    if (!isPasswordMatched) {
      return jsonError(res, 403, "Invalid Credentials");
    }

    const accessToken = generateAccessToken(userExists);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return jsonSuccess(res, 200, "User logged in Successfully");
  } catch (error) {
    console.error(`Error while Login User : ${error}`);
    jsonError(res, 500, "Internal Server Error");
  }
};

module.exports = { register, login };
