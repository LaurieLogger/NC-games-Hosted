const db = require(`${__dirname}/../db`);

exports.fetchAllCategories = async () => {
  const { rows: categories } = await db.query(`SELECT * FROM categories;`);

  return categories;
};

exports.fetchReviewById = async (id) => {
  const {
    rows: [review],
  } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]);
  if (review === undefined) {
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
