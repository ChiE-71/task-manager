import express, { json } from 'express';
import bcrypt from 'bcryptjs';
import jwt from jsonwebtoken;
import router from 'router'

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) { 
        return res.status(400).json({ message: 'User already exists' });
    }
    
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user and store it in the mock database
    const newUser = { username, password: hashedPassword };
  })