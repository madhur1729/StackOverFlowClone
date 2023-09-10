require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    user = await User.create({ name, email, password });
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Success", data: { user, token, isAuthenticated: true, } });
  } 
  catch (error) {
    console.log(error);
    return res.status(400).json({ message: "User already registered", error: error });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.comparePasswords(password, function (error, match) {
        if (error) return res.status(401).json({ message: "Invalid email or password" });
        else if (!match) return res.status(401).json({ message: "Invalid password" });
        else {
          const token = jwt.sign({ email }, process.env.JWT_SECRET);
          return res.status(200).json({ message: "Success", data: { user, token, isAuthenticated: true, } });
        }
      });
    }

    else return res.status(401).json({ message: "Invalid email or password" }); 
  } 
  catch (error) {
    return res.status(400).json({ message: "Try again" });
  }
};

module.exports.loadUser = async (req, res) => {
  
  if (!req.user.email) return res.status(401).json({ message: "Access denied" });
  
  try {
    const loadedUser = await User.findOne({ email: req.user.email });
    if (!loadedUser) return res.status(401).json({ message: "Access denied" });
    token = req.headers["authorization"].split(" ")[1];
    return res.status(200).json({ message: "user found", data: { user: loadedUser, token, isAuthenticated: true, } });
  } 
  catch (error) {
    return res.status(401).json({ message: "Access denied" });
  }
};

module.exports.logout = (req, res) => {
  return res.json({ message: "Logged Out!", isAuthenticated: false });
};

module.exports.authCheck = (req, res, next) => {

  if (!req.headers["authorization"]) return res.status(401).json({ isAuthenticated: false, message: "Header not present" });
  else {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ isAuthenticated: false, message: "No Token" });
    else {
      jwt.verify(token, process.env.JWT_SECRET , (error, user) => {
        if (error) {
          console.log('Invalid token');
          return res.status(401).json({ isAuthenticated: false, message: "Invalid token", error: error.message });
        }
        req.user = user;
        next();
      });
    }
  }
};
