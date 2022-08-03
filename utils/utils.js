const format = require("pg-format");
const db = require(`${__dirname}/../db`);

exports.checkExists = async (table, column, value) => {
  if (!value) {
    return value;
  }
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  const { rows: output } = await db.query(queryStr, [value]);

  if (output.length === 0) {
    return Promise.reject({ status: 404, msg: `${column} not found` });
  }
  return output;
};
