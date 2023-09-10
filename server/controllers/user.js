const User = require("../models/user");

module.exports.findUser = (req, res, next) => {
  User.findOne({email: req.user.email}).then(user => {
    req.user = user;
    next();
  })
  .catch(error => { next(); })
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ message: "Success", data: users });
  } 
  catch (error) {
    return res.status(400).json({ message: "Failed" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user = await User.findById(user_id).populate([ { path: "answers" }, { path: "questions" } ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.questions.sort(function (que1, que2) {
      return (que2.upvotes.length - que2.downvotes.length) - (que1.upvotes.length - que1.downvotes.length);
    });
    user.answers.sort(function (que1, que2) {
      return (que2.upvotes.length - que2.downvotes.length) - (que1.upvotes.length - que1.downvotes.length);
    });

    return res.status(200).json({ message: "User Found", data: user });
  } 
  catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, password, newPassword, confirmPassword } = req.body;
    const user = req.user;
    const id = user._id;
    if (name === "") return res.status(409).json({ message: "Name cannot be empty" });

    user.comparePasswords(password, async function (error, match) {
      if (error) return res.status(400).json({ message: "Invalid password" });
      else if (!match) return res.status(401).json({ message: "Invalid password" });
      else {
        if (name && name !== user.name) {
          const nameExists = await User.findOne({ name });
          if (nameExists) return res.status(409).json({ message: "Username already exists" });   
        }

        const newUser = await User.findById(id);
        if (newPassword !== confirmPassword) return res.status(409).json({ message: "Passwords doesn't match" });
        if (name) newUser.name = name;
        if ( newPassword && newPassword.length > 5 && newPassword === confirmPassword ) newUser.password = newPassword;
        if (newPassword === "") await User.findByIdAndUpdate(id, { name });
        else await newUser.save();
        return res.status(200).json({ message: "User updated successfully", data: newUser });
      }
    });
  } 
  catch (error) {
    return res.status(500).json({ message: "Unable to update user" });
  }
};
