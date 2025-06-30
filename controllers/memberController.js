const Member = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    if (userId !== req.params.memberId) {
      return res.status(403).send("You can only update your own password");
    }
    const member = await Member.findById(req.params.memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (!(await bcrypt.compare(oldPassword, member.password))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    member.password = newPassword;
    await member.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMemberProfile = async (req, res) => {
  try {
    const { memberName, yob, gender, userId } = req.body;
    if (userId !== req.params.memberId) {
      return res.status(403).send("You can only update your own information");
    }
    const member = await Member.findByIdAndUpdate(
      req.params.memberId,
      { memberName, yob, gender },
      { new: true }
    );
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCollectors = async (req, res) => {
  try {
    const memberData = await Member.find();
    res.status(200).json(memberData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
