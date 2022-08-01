exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    const errorMsg = { msg: "Bad request" };
    res.status(400).send(errorMsg);
  }
  if (err.code === "23502") {
    const errorMsg = { msg: "Bad request" };
    res.status(400).send(errorMsg);
  }
};
