const express = require("express");
const app = express();

const {
  getAllCategories,
  getReviewById,
} = require(`${__dirname}/controllers/controllers.js`);
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require(`${__dirname}/errors/errors.js`);
///////////////////////////////////////////////////////////////////////////

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("*", (req, res) => {
  const msg = { msg: "Path does not exist" };
  res.status(404).send(msg);
});
////////////////////////////////////////////////////////////////////////////
app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
