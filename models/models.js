const db = require(`${__dirname}/../db`);

exports.fetchAllCategories = async () => {
  const { rows: categories } = await db.query(`SELECT * FROM categories;`);

  return categories;
};

exports.fetchReviewById = async (id) => {
  const {
    rows: [review],
  } = await db.query(
    `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_body, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
    [id]
  );
  if (!review) {
    return Promise.reject({
      status: 404,
      msg: "Not found",
    });
  }
  return review;
};

exports.updateReview = async (id, num) => {
  const {
    rows: [updatedReview],
  } = await db.query(
    `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
    [id, num]
  );
  if (updatedReview === undefined) {
    return Promise.reject({
      status: 404,
      msg: "Not found",
    });
  }
  return updatedReview;
};

exports.fetchAllUsers = async () => {
  const { rows: users } = await db.query(`SELECT * FROM users;`);

  return users;
};

exports.fetchAllReviews = async () => {
  const { rows: reviews } = await db.query(
    `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id;`
  );

  return reviews;
};

exports.fetchCommentsByReviewId = async (id) => {
  const { rows: comments } = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [id]
  );
  return comments;
};
