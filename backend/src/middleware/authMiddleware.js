import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import pool from "../db.js"; // adjust path if needed

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB (more secure than trusting token alone)
      const result = await pool.query(
        "SELECT id, email FROM users WHERE id = $1",
        [decoded.id],
      );

      const user = result.rows[0];

      if (!user) {
        res.status(401);
        throw new Error("User no longer exists");
      }

      // Attach user to request
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
