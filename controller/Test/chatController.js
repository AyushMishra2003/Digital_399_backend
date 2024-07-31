import User from "../../models/Test/userModel.js";
import path from "path";

// Controller to add a new user
export const addUser = async (req, res) => {
  const { username } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const user = new User({ username, photoUrl });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
