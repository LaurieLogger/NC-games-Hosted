const db = require(`${__dirname}/../db`);
const fs = require("fs/promises");

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

exports.fetchAllReviews = async (
  sortBy = "created_at",
  order = "DESC",
  category
) => {
  const validSortBys = [
    "created_at",
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "asc", "DESC", "desc"];

  if (!validSortBys.includes(sortBy) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryMain = `SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  let orderSort = `GROUP BY reviews.review_id ORDER BY ${sortBy} ${order};`;

  let insertArr = [];
  if (category) {
    insertArr.push(category);
    queryMain += `WHERE category = $1 `;
  }
  queryMain += orderSort;

  const { rows: reviews } = await db.query(queryMain, insertArr);

  return reviews;
};

exports.fetchCommentsByReviewId = async (id) => {
  const { rows: comments } = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [id]
  );
  return comments;
};

exports.addComment = async (postArr) => {
  const {
    rows: [newComment],
  } = await db.query(
    `INSERT INTO comments(body, votes, author, review_id) VALUES($3, 0, $2, $1) RETURNING *;`,
    postArr
  );

  return newComment;
};

exports.removeCommentById = async (id) => {
  const {
    rows: [removedComment],
  } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [id]
  );
  if (!removedComment) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return removedComment;
};

exports.fetchAllApis = async () => {
  const apiData = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");

  const apis = JSON.parse(apiData);

  return apis;
};
