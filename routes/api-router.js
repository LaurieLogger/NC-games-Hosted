const apiRouter = require("express").Router();
const categoryRouter = require(`${__dirname}/categories-router.js`);
const userRouter = require(`${__dirname}/users-router.js`);
const commentRouter = require(`${__dirname}/comments-router.js`);
const reviewRouter = require(`${__dirname}/reviews-router.js`);
const { getAllApis } = require(`${__dirname}/../controllers/controllers.js`);

apiRouter.get("/", getAllApis);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
