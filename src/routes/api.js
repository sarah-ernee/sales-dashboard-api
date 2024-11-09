import { Router } from "express";
const router = Router();
import { query } from "../config";

// GET - all records
router.get("/categories", async (req, res) => {
  const [rows] = await query("SELECT * FROM product_category");
  res.json(rows);
});

// POST - filtered records
// filter requestbody
router.get("/orders", async (req, res) => {
  const [rows] = await query("SELECT * FROM sales_order");
  res.json(rows);
});

// PATCH - update records

// DELETE - remove records by orderNo

// POST - create new record

export default router;
