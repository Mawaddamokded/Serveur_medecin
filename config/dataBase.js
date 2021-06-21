const { createPool } = require("mysql");

const pool = createPool({
  host:"localhost",
  user:"root",
  password: "",
  database: "gestion_cabinet",
  connectionLimit: 10
});


module.exports = pool;