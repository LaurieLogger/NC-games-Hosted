const { fetchAllCategories } = require(`${__dirname}/../models/models.js`);

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
