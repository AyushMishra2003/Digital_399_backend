import User from "../models/Chat_Model/chat.user.model.js";

const addUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.create({
      username,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "not added",
      });
    }

    res.status(200).json({
      success: true,
      message: "user added",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const alluser = await User.find({});

    if (!alluser) {
      res.status(400).json({
        success: false,
        message: "not added",
      });
    }

    res.status(200).json({
      success: true,
      message: "All user",
      data: alluser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addUser, getUser };
