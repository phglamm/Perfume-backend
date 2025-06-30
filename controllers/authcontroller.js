const Member = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { email, password, memberName, yob, gender } = req.body;
    // Check if user already exists
    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const newUser = new Member({
      email,
      password,
      memberName,
      yob,
      gender,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const member = await Member.findOne({ email });

    if (!member || !(await bcrypt.compare(password, member.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const memberLogin = {
      _id: member._id,
      memberName: member.memberName,
      email: member.email,
      yob: member.yob,
      gender: member.gender,
      isAdmin: member.isAdmin,
    };

    // Generate JWT token
    const token = jwt.sign({ _id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ member: memberLogin, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, memberName, yob, gender } = req.body;

    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Member({ email, password, memberName, yob, gender });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
