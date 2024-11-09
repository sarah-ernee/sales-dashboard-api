const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

const db = mysql.createPool({
  host: "db",
  user: "devUser",
  password: "devUser",
  database: "vuetest",
});

app.use(cors());
app.use(express.json());
const router = express.Router();

// Attach db to the request object for all routes
router.use((req, res, next) => {
  req.db = db;
  next();
});

// GET - all records (called on page render and minutely refreshes)
router.get("/records", (req, res) => {
  req.db
    .promise()
    .query(
      `
    SELECT 
      a.object_id AS order_no,
      a.customer_name,
      a.status,
      b.name AS category,
      a.country,
      DATE_FORMAT(a.created_date, '%c/%e/%Y') AS created_date
    FROM sales_order a
    JOIN product_category b ON a.category_id = b.object_id
  `
    )
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching orders" });
    });
});

// POST - filtered records
// Separated from the GET /records endpoints for clearer separation of concern
router.post("/records", (req, res) => {
  const { date_to, date_from, customers, countries, status, category } =
    req.body;

  let query = `
    SELECT 
      a.object_id AS order_no,
      a.customer_name,
      a.status,
      b.name AS category,
      a.country,
      DATE_FORMAT(a.created_date, '%c/%e/%Y') AS created_date
    FROM sales_order a
    JOIN product_category b ON a.category_id = b.object_id
  `;
  const conditions = [];
  const values = [];

  // Conditional WHERE clauses
  if (date_to && date_from) {
    conditions.push("a.created_date BETWEEN ? AND ?");
    values.push(date_to, date_from);
  }
  if (customers.length > 0) {
    conditions.push(
      `a.customer_name IN (${customers.map(() => "?").join(", ")})`
    );
    values.push(...customers);
  }
  if (countries.length > 0) {
    conditions.push(`a.country IN (${countries.map(() => "?").join(", ")})`);
    values.push(...countries);
  }
  if (status.length > 0) {
    conditions.push(`a.status IN (${status.map(() => "?").join(", ")})`);
    values.push(...status);
  }
  if (category.length > 0) {
    conditions.push(`b.name IN (${customer_name.map(() => "?").join(", ")})`);
    values.push(...category);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  req.db
    .promise()
    .query(query, values)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching filtered orders" });
    });
});

// POST - create new record (stubbed, add your creation logic)
// PATCH - update records (stubbed, add your update logic)
// DELETE - remove records by orderNo (stubbed, add your delete logic)

app.use("/api", router);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
