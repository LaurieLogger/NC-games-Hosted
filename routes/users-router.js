const userRouter = require("express").Router();
const { getAllUsers } = require(`${__dirname}/../controllers/controllers.js`);

userRouter.get("/", getAllUsers);

module.exports = userRouter;
