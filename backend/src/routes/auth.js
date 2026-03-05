import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import CropRecommendation from "../models/cropRecommendation.js";

const router = express.Router();


// register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, landType, state, requirement, farmSize } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'email already in use' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash: hash, landType, state, requirement, farmSize });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        landType: user.landType,
        state: user.state,
        requirement: user.requirement,
        farmSize: user.farmSize
      },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        landType: user.landType,
        state: user.state,
        requirement: user.requirement,
        farmSize: user.farmSize
      },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// endpoint to update onboarding/profile data after login
router.post("/onboarding", async (req, res) => {
  try {
    const { farmSize, soilType, cropType, location } = req.body;

    const result = await CropRecommendation.create({
      farmSize,
      soilType,
      cropType,
      location
    });

    res.json({
      message: "Farm information saved",
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
