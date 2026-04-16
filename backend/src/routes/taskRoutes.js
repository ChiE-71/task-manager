import express from "express";
import pool from "../db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all tasks for the authenticated user
router.get("/", protect, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task for the authenticated user
router.post("/", protect, async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ message: "Description must be a non-empty string" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, description, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *",
      [req.user.id, description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task by ID for the authenticated user  
router.patch("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  try {
    const updatedResult = await pool.query(
      `UPDATE tasks 
       SET 
         description = COALESCE($1, description),
         completed = COALESCE($2, completed),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [task ? task.trim() : null, completed, id, req.user.id]
    );

    if (updatedResult.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete a task by ID for the authenticated user
router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const deleteResult = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;