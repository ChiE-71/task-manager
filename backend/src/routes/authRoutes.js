import express, { json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email.includes("@")) {
    return res.status(401).json({ message: "Invalid email" });
  }

  try {
    // Check if the user already exists
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)   ", [
      email,
    ]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(402).json({ message: "User already exists" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
      return res
      .status(200)
      .json({ message: `User registered successfully, ${email}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    const userEmail = result.rows[0];

    if (!userEmail) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token (if using)
    const token = jwt.sign({ id: userEmail.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", user: { id: userEmail.id, email: userEmail.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
