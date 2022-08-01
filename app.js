const express = require("express");
const app = express();

const { getAllCategories } = require(`${__dirname}/controllers/controllers.js`);

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.all("*", (req, res) => {
  const msg = { msg: "Error 404: Path does not exist" };
  res.status(404).send(msg);
});

module.exports = app;
