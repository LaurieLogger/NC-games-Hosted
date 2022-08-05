/////////////////////////////REQUIRING/////////////////////////////////////
const express = require("express");
const apiRouter = require(`${__dirname}/routes/api-router`);
const app = express();

const {
  handleCustomErrors,
  handlePsqlErrors,
} = require(`${__dirname}/errors/errors.js`);
///////////////////////ROUTING&PARSING/////////////////////////////////////

app.use(express.json());
app.use("/api", apiRouter);

////////////////////////ERROR HANDLING/////////////////////////////////////
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all("*", (req, res) => {
  const msg = { msg: "Path does not exist" };
  res.status(404).send(msg);
});

module.exports = app;
