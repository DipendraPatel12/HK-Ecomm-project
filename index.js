const session = require("express-session");
const express = require("express");
const db = require("./src/models");
require("dotenv").config({ quiet: true });
const port = process.env.PORT;
const app = express();
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const index = require("./src/routes/index");
const attachUser = require("./src/middlewares/attachUser");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(expressEjsLayouts);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(attachUser);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.set("layout", "layout/main");

app.use("/", index.authRoutes);
app.use("/admin", index.adminRoutes);
app.use("/product", index.productRoutes);
app.use("/cart", index.cartRoutes);
app.use("/user", index.userRoutes);

db.sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log(`connection failed`);
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
