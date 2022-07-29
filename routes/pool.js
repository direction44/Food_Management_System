var mysql = require("mysql");
var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "1234",
  database: "foodmanagement",
  multipleStatement: true,
  connectionLimit: "100",
});
module.exports = pool;
