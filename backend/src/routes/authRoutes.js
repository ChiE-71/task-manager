import express, { json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();

  const validateEmail = (email) => {
    return typeof email === "string" && email.trim() !== "" && email.length > 0 && email.includes("@");
  };

  const validatePassword = (password) => {
    return typeof password === "string" && password.trim() !== "" && password.length >= 8;
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Check if the user already exists
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [
      email,
    ]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);
      const newUser = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
      const newUserId = newUser.rows[0].id;
      await pool.query("INSERT INTO tasks (user_id, task, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)", [newUserId, "Welcome! Here's your first task! Create new task for yourself!"]);
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
  let { email, password } = req.body;

  email = email.trim().toLowerCase();
  password = password.trim();

  try {
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    const user = result.rows[0];

    if (user.failed_attempts > 5 && user.last_failed_attempt) {
      const lastFailedAttempt = new Date(user.last_failed_attempt);
      const now = new Date();
      const timeDiff = (now - lastFailedAttempt) / (1000 * 60); // Time difference in minutes

      if (timeDiff < 5) {
        return res.status(403).json({ message: "Account locked due to too many failed login attempts. Please try again later." });
      } else {
        await pool.query("UPDATE users SET failed_attempts = 0 WHERE id = $1", [user.id]);
      }
    }

    if (user && user.failed_attempts >= 5) {
      await pool.query("UPDATE users SET last_failed_attempt = NOW() WHERE id = $1", [user.id]);

      return res.status(403).json({ message: "Account locked due to too many failed login attempts. Please try again later." });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await pool.query("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = $1", [user.id]);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token (if using)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const last_login = new Date();
    await pool.query("UPDATE users SET last_login = $1 WHERE id = $2", [last_login, user.id]);
    await pool.query("UPDATE users SET failed_attempts = 0 WHERE id = $1", [user.id]);

    return res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
