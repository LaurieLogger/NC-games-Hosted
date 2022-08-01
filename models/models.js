const db = require(`${__dirname}/../db`);

exports.fetchAllCategories = async () => {
  const { rows: categories } = await db.query(`SELECT * FROM categories;`);

  return categories;
};
