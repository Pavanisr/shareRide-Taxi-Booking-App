const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "shareride_db",
  password: "12345",
  port: 5432,
});


pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
  } else {
    console.log("Connected to PostgreSQL database successfully!");
  }
  release(); // release the client back to the pool
});

module.exports = pool;
