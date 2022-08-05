const commentRouter = require("express").Router();
const {
  deleteCommentById,
} = require(`${__dirname}/../controllers/controllers.js`);

commentRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentRouter;
