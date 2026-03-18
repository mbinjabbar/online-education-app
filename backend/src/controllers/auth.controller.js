import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    const passwordMatched = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordMatched) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashPassword, image });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          image: newUser.image,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};