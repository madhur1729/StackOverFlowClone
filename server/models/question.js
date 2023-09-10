const mongoose = require("mongoose");

const question = new mongoose.Schema({
  title: { type: String, required: true, },
  description: { type: String, required: true, },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tags: [{ type: String }],
}, { timestamps: true, });

module.exports = mongoose.model("Question", question);
