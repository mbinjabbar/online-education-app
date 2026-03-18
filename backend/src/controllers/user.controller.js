import User from "../models/User.model.js";
import fs from "fs";
import path from "path";

// GET /api/users/me
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.set("Cache-Control", "no-store");
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { username, email } = req.body;

    if (req.file && user.image) {
      const oldImagePath = path.join("public/uploads", user.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      image: req.file ? req.file.filename : user.image,
    });

    await user.reload();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.image) {
      const imagePath = path.join("public/uploads", user.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await user.destroy();

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};