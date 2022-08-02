const express = require("express");
const app = express();

const {
  getAllCategories,
  getReviewById,
  patchReview,
  getAllUsers,
  getAllReviews,
  getCommentsByReviewId,
  postComment,
} = require(`${__dirname}/controllers/controllers.js`);
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require(`${__dirname}/errors/errors.js`);
///////////////////////////////////////////////////////////////////////////

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getAllUsers);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);

app.all("*", (req, res) => {
  const msg = { msg: "Path does not exist" };
  res.status(404).send(msg);
});
////////////////////////////////////////////////////////////////////////////
app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
