const reviewRouter = require("express").Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
  getCommentsByReviewId,
  postComment,
} = require(`${__dirname}/../controllers/controllers.js`);

reviewRouter.route("/").get(getAllReviews);

reviewRouter
  .route("/:review_id")

  .get(getReviewById)
  .patch(patchReview);

reviewRouter
  .route("/:review_id/comments")

  .get(getCommentsByReviewId)
  .post(postComment);

module.exports = reviewRouter;
