const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    if (userId !== req.params.userId) {
      return res.status(403).send("You can only update your own password");
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    user.password = newPassword;
    await User.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMemberProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, yob, gender, phone } = req.body;
    if (!userId) {
      return res.status(403).send("No user ID provided");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, yob, gender, phone },
      { new: true }
    ).select("username phone email fullName yob gender");

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("username phone email fullName yob gender")
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
