const express = require("express");
const db = require("./src/models");
require("dotenv").config({ quiet: true });
const port = process.env.PORT;
const app = express();
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth");
const path = require("path");
const { title } = require("process");

app.use(expressEjsLayouts);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.set("layout", "layout/main");

app.get("/", (req, res) => {
  return res.render("pages/home", { title: "Home" });
});

app.get("/login", (req, res) => {
  return res.render("auth/login", { layout: false, title: "Login" });
});

app.get("/register", (req, res) => {
  return res.render("auth/register", { layout: false, title: "Register" });
});

app.use("/api/auth", authRoutes);

db.sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log(`connection failed`);
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
