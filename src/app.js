const express = require("express");
const mysql = require("mysql2");
const named = require("named-placeholders")();
const cors = require("cors");
const app = express();

const db = mysql.createPool({
  host: "db",
  user: "devUser",
  password: "devUser",
  database: "vuetest",
  charset: "utf8mb4",
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

  req.db
    .promise()
    .query(query)
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(204).json({ message: "No sales records found in database" });
      }

      return res.status(200).json({
        message: "Successfully retrieved all sales records",
        data: rows,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve all sales records" });
    });
});

// POST - filtered records
// Separated from the GET /records endpoints for clearer separation of concern
router.post("/records", (req, res) => {
  const { date_from, date_to, customers, countries, status, category } =
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

  const params = {};
  const conditions = [];

  // Conditional WHERE clauses
  if (date_from && date_to) {
    conditions.push("a.created_date BETWEEN :dateFrom AND :dateTo");
    params.dateFrom = date_from;
    params.dateTo = date_to;
  }

  if (customers?.length) {
    conditions.push(`a.customer_name IN (:customers)`);
    params.customers = customers;
  }

  if (countries?.length) {
    conditions.push(`a.country IN (:countries)`);
    params.countries = countries;
  }

  if (status?.length) {
    conditions.push(`a.status IN (:status)`);
    params.status = status;
  }

  if (category?.length) {
    conditions.push(`b.name IN (:categories)`);
    params.categories = category;
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  const [preparedQuery, values] = named(query, params);

  req.db
    .promise()
    .query(preparedQuery, values)
    .then(([rows]) => {
      let records = rows;
      if (records.length === 0) {
        return res.status(204).json({
          message: "No sales records retrieved for the filter settings",
        });
      }

      return res.status(200).json({
        message: "Successfully retrieved filtered sales records",
        records,
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to retrieve filtered sales records" });
    });
});

app.use("/api", router);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
