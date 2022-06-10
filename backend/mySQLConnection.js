module.exports = function () {
  let mysql = require("mysql2");
  let connCreds = require("./connectionsConfig.json");
  //Establish Connection to the DB
  let connection = mysql.createConnection({
    host: connCreds["host"],
    user: connCreds["user"],
    password: connCreds["password"],
    database: connCreds["database"],
    port: 3306,
  });

  //Instantiate the connection
  connection.connect(function (err) {
    if (err) {
      console.log(`connectionRequest Failed ${err}`);
    } else {
      console.log("DB connectionRequest Successful ");
    }
  });

  //return connection object
  return connection;
};
