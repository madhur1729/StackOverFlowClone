const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");

module.exports.updateAnswer = async (req, res) => {
  try {
    const id = req.params.answer_id;
    const { description } = req.body;
    const answer = await Answer.findById(id);

    if (answer.author._id.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Access denied", });
    
    const newAnswer = await Answer.findOneAndUpdate({ _id: id }, { description });
    return res.status(200).json({ message: "Updated successfully", });
  } 
  catch (error) {
    return res.status(404).json({ message: "Unable to update answer", });
  }
};

module.exports.deleteAnswer = async (req, res) => {
  try {
    const answer_id = req.params.answer_id;

    if (!req.user.answers.includes(answer_id)) return res.status(401).json({ message: "Access denied", });
    
    const answer = await Answer.findByIdAndDelete(answer_id);

    if (!answer) return res.status(404).json({ message: "No answer found", });
    
    const newUpdatedUser = await User.findByIdAndUpdate(req.user._id, {
      answers: [ ...req.user.answers.filter((ans) => ans._id.toString() !== answer_id.toString()),],
    });

    let question = await Question.findById(answer.question, (error, data) => {
      if (error) return res.status(400).json({ message: "No question found", });
      else if (!data) return res.status(404).json({ message: "No question found", });
  
      data.answers = [ ...data.answers.filter((ans) => ans._id.toString() !== answer_id.toString()),];
      data.save();    
    });

    
    const newQuestion = await Question.findById(answer.question).populate({ path: "answers", populate: { path: "author" }, });  
    return res.status(200).json({ message: "Deleted successfully", data: newQuestion.answers, });    
  } 
  catch (error) {
    return res.status(500).json({ message: "Unable to delete answer", });
  }
};

module.exports.vote = async (req, res) => {
  try {
    Answer;

    const answer_id = req.params.answer_id;
    const { vote } = req.body;
    let upvoted = false;
    let downvoted = false;

    const foundAnswer = await Answer.findById(answer_id);
    upvoted = foundAnswer.upvotes.includes(req.user._id);
    downvoted = foundAnswer.downvotes.includes(req.user._id);

    let newQuestion;
    let message;
    let votes = foundAnswer.upvotes.length - foundAnswer.downvotes.length;

    if (vote && upvoted) {
      newAnswer = await Answer.findByIdAndUpdate(answer_id, {
        upvotes: foundAnswer.upvotes.filter((user_id) => user_id.toString() !== req.user._id.toString()),
      });
      message = "upvote removed";
      votes -= 1;
    } 
    else if (vote && !upvoted && !downvoted) {
      newAnswer = await Answer.findByIdAndUpdate(answer_id, {
        upvotes: [...foundAnswer.upvotes, req.user._id],
      });
      message = "upvote added";
      votes += 1;
    } 
    else if (!vote && downvoted) {
      newAnswer = await Answer.findByIdAndUpdate(answer_id, {
        downvotes: foundAnswer.downvotes.filter((user_id) => user_id.toString() !== req.user._id.toString()),
      });
      message = "downvote removed";
      votes += 1;
    } 
    else if (!vote && !downvoted && !upvoted) {
      newAnswer = await Answer.findByIdAndUpdate(answer_id, {
        downvotes: [...foundAnswer.downvotes, req.user._id],
      });
      message = "downvote added";
      votes -= 1;
    } 
    else message = "remove previous vote";
    
    res.status(200).json({ message, votes });
  } 
  catch (error) {
    res.status(500).json({ message: error.message, votes });
  }
};