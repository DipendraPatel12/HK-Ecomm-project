const express = require("express");
const db = require("./src/models");
require("dotenv").config({ quiet: true });
const port = process.env.PORT;
const app = express();
const expressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const index = require("./src/routes/index");

app.use(expressEjsLayouts);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.set("layout", "layout/main");

app.use("/", index.authRoutes);
app.use("/admin", index.adminRoutes);

db.sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log(`connection failed`);
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
