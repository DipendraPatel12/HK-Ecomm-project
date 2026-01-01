const { renderError, renderSuccess } = require("../utilities/response");
const user_service = require("../services/user");
const { generateAccessToken } = require("../utilities/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await user_service.findUser(email);

    if (userExists) {
      return renderError(res, "auth/login", "Register", "Email Already Exists");
    }
    const hashedPassword = await user_service.hashedPassword(password);

    await user_service.createUser(name, email, hashedPassword);

    return renderSuccess(
      res,
      "auth/register",
      "Register",
      "Registration SuccessFull.login now..",
      { error: null }
    );
  } catch (error) {
    console.error(`Error while Register User : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await user_service.findUser(email);

    if (!userExists) {
      return renderError(res, "auth/login", "login", "Email Not Found");
    }
    const isPasswordMatched = await user_service.matchPassword(
      password,
      userExists.password
    );

    if (!isPasswordMatched) {
      return renderError(res, "auth/login", "login", "Invalid Credentials");
    }

    const accessToken = generateAccessToken(userExists);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "LAX",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(`Error while Login User : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "LAX",
    });

    res.redirect("/");
  } catch (error) {
    console.error(`Error while Logout : ${error}`);
    return renderError(res, "pages/500", "Error", "Internal Server Error");
  }
};
module.exports = { register, login, logout };
