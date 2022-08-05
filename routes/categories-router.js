const categoryRouter = require("express").Router();
const {
  getAllCategories,
} = require(`${__dirname}/../controllers/controllers.js`);

categoryRouter.get("/", getAllCategories);

module.exports = categoryRouter;
