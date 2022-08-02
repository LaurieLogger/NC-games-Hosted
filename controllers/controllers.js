const {
  fetchAllCategories,
  fetchReviewById,
  updateReview,
  fetchAllUsers,
} = require(`${__dirname}/../models/models.js`);

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
