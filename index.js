const express = require("express");
const db = require("./src/models");
require("dotenv").config({ quiet: true });
const port = process.env.PORT;
const app = express();
const expressEjsLayouts = require("express-ejs-layouts");
app.use(expressEjsLayouts());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require("./src/routes/auth");
const path = require("path");
app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "src/views"));
app.set("layout", "layout/main");

app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use("/auth", authRoutes);

db.sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log(`connection failed`);
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
