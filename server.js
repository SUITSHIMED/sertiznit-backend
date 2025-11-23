import express from "express";
import { Pool } from "pg";

const app = express();
const PORT = 3000;


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sertiznit",
  password: "0000",
  port: 5432,
});


app.use(express.json());


app.get("/artisans", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artisans");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error getting artisans" });
  }
});

//kanjib
app.get("/artisans/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artisans WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error getting artisan" });
  }
});


app.post("/artisans", async (req, res) => {
  const { nom, prenom, profession, telephone, ville } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO artisans (nom, prenom, profession, telephone, ville) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nom, prenom, profession, telephone, ville]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating artisan" });
  }
});


app.put("/artisans/:id", async (req, res) => {
  const { nom, prenom, profession, telephone, ville } = req.body;

  try {
    const result = await pool.query(
      "UPDATE artisans SET nom=$1, prenom=$2, profession=$3, telephone=$4, ville=$5 WHERE id=$6 RETURNING *",
      [nom, prenom, profession, telephone, ville, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating artisan" });
  }
});


app.delete("/artisans/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM artisans WHERE id=$1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json({ message: "Artisan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting artisan" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
