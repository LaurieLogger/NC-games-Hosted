const db = require(`${__dirname}/../db`);

exports.fetchAllCategories = async () => {
  const { rows: categories } = await db.query(`SELECT * FROM categories;`);

  return categories;
};

exports.fetchReviewById = async (id) => {
  const {
    rows: [review],
  } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]);
  console.log(review);
  if (review === undefined) {
    return Promise.reject({
      status: 404,
      msg: "Error 404: Not found",
    });
  }
  return review;
};
