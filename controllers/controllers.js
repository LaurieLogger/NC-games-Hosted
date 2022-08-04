const {
  fetchAllCategories,
  fetchReviewById,
  updateReview,
  fetchAllUsers,
  fetchAllReviews,
  fetchCommentsByReviewId,
  addComment,
  removeCommentById,
} = require(`${__dirname}/../models/models.js`);
const { checkExists } = require(`${__dirname}/../utils/utils.js`);

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id: id } = req.params;
  fetchReviewById(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id: id } = req.params;
  const { inc_votes: num } = req.body;
  updateReview(id, num)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  const { sort_by: sortBy } = req.query;
  const { order } = req.query;
  const { category } = req.query;

  Promise.all([
    fetchAllReviews(sortBy, order, category),
    checkExists("reviews", "category", category),
  ])

    .then(([reviews]) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id: id } = req.params;

  Promise.all([fetchCommentsByReviewId(id), fetchReviewById(id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id: id } = req.params;
  const { username: user } = req.body;
  const { body } = req.body;
  const postArr = [id, user, body];

  addComment(postArr)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id: id } = req.params;
  removeCommentById(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
