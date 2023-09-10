const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");

module.exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags, author } = req.body;
    const newQuestion = await Question.create({ title, description, author, tags });
    await User.findByIdAndUpdate(req.user._id, { $push: { questions: newQuestion._id }, });
    return res.status(200).json({ message: "Question created successfully ", newQuestion, });
  } 
  catch (error) {
    return res.status(400).json({ message: "Unable to create question" });
  }
};

module.exports.getQuestion = async (req, res) => {
  try {

    const foundQuestion = await Question.findOne({ _id: req.params.question_id })
    .populate([ { path: "author" }, { path: "answers", populate: { path: "author" } }, ]);
    
    if (!foundQuestion) return res.status(404).json({ message: "No question Found" });
    return res.status(200).json({ message: "Question found", data: foundQuestion });
  } 
  catch (error) {
    res.status(404).json({ message: "Unable to find question", error });
  }
};

module.exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.question_id;
    const { title, description, tags } = req.body;

    let Tags = tags.trim().split(" ");
    Tags = [...new Set(Tags)];

    const question = await Question.findById(id);
    if (question.author._id.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Access denied" });
  
    const newQuestion = await Question.findOneAndUpdate({ _id: id }, { title, description, tags: Tags });
    
    return res.status(200).json({ message: "Updated successfully" });
  } 
  catch (error) { 
    return res.status(404).json({ message: "Unable to update question", });
  }
};

module.exports.getAllQuestions = async (req, res) => {
  try {
    const Questions = await Question.find({}).populate("author");
    res.status(200).json({ message: "Questions fetched successfully", data: Questions });
  } 
  catch (error) {
    return res.status(400).json({ message: "Unable to fetch questions" });
  }
};

module.exports.getTopQuestions = async (req, res) => {
  try {
    const Questions = await Question.find({}).populate("author");
    Questions.sort(function (que1, que2) {
      return (que2.upvotes.length - que2.downvotes.length) - (que1.upvotes.length - que1.downvotes.length);
    });
    res.status(200).json({ message: "Questions fetched successfully", data: Questions });
  } 
  catch (error) {
    return res.status(400).json({ message: "Unable to fetch questions" });
  }
};

module.exports.getQuestionsTags = async (req, res) => {
  try {
    let questionsTags = await Question.find({}).populate("author");

    let Tags = req.body.tags.split(" ").map((tag) => tag.toLowerCase());
    Tags = [...new Set(Tags)];

    if (Tags[0] !== "") {
      questionsTags = questionsTags.filter((question) => {
        for (let i = 0; i < Tags.length; i++) if (question.tags.includes(Tags[i])) return true;
        return false;
      });
    }

    switch (req.params.pathname) {
      case "top":
        questionsTags.sort(function (que1, que2) {
          return (que2.upvotes.length - que2.downvotes.length) - (que1.upvotes.length - que1.downvotes.length);
        });
        break;
      case "all":
        questionsTags.reverse();
        break;
    }

    return res.status(200).json({ message: "Questions fetched successfully", data: questionsTags });
  } 
  catch (error) {
    return res.status(404).json({ message: "Unable to fetch questions" });
  }
};

module.exports.getTopTags = async (req, res) => {
  try {
    const questionsMap = new Map();
    const questions = await Question.find({});

    questions.map((question) => {
      return question.tags.forEach((tag) => {
        if (!questionsMap.get(tag)) questionsMap.set(tag, 1);
        else questionsMap.set(tag, questionsMap.get(tag) + 1);
      });
    });

    const Tags = [...questionsMap];
    Tags.sort(function (a, b) { return b[1] - a[1]; });
    const topTags = Tags.slice(0, Math.min(5, Tags.length));
    return res.status(200).json({ message: "Success", data: topTags });
  } 
  catch (error) {
    return res.status(200).json({ message: "Failed" });
  }
};

module.exports.getAllAnswers = async (req, res) => {
  try {
    const id = req.params.question_id;
    const question = await Question.findById(id).populate([{ path: "answers", populate: { path: "author" } }]);

    if (!question) throw new Error("Question not found");
    res.status(200).json({ message: "Success", data: question.answers });
  } 
  catch (error) {
    return res.status(400).json({ message: "Failed" });
  }
};

module.exports.createAnswer = async (req, res) => {
  try {
    const question_id = req.params.question_id;
    const { ans: answer } = req.body;
    const newAnswer = await Answer.create({ description: answer, author: req.user._id, question: question_id, });
    
    let user = await User.findByIdAndUpdate(req.user._id, { $push: { answers: newAnswer._id } });
    let question = await Question.findByIdAndUpdate(question_id, { $push: { answers: newAnswer._id } });
    
    let populatedQuestion = await Question.findById(question_id).populate([{ path: "answers", populate: { path: "author" } }]);

    return res.status(200).json({ payload: populatedQuestion.answers, message: "Success" });
  } 
  catch (error) {
    return res.status(400).json({ message: "Failed" });
  }
};

module.exports.deleteQuestion = async (req, res) => {
  try {
    const question_id = req.params.question_id;
    if (!req.user.questions.includes(question_id)) return res.status(401).json({ message: "Access denied" });
    
    const question = await Question.findById(question_id);
    for (let i = 0; i < question.answers.length; i++) {
      const answer = await Answer.findById(question.answers[i]);
      const user = await User.findById(answer.author);
      user.answers = [...user.answers.filter((ans_id) => ans_id.toString() !== answer._id.toString()),];
      await user.save();
    }

    await Answer.deleteMany({ _id: { $in: question.answers } });
    await Question.findByIdAndDelete(question_id);
    const user = await User.findById(req.user._id);
    user.questions = [...user.questions.filter((q_id) => q_id.toString() !== question_id.toString()),];
    await user.save();
    
    return res.status(200).json({ message: "Success" });
  } 
  catch (error) {
    res.status(500).json({ mesage: "Failed" });
  }
};



module.exports.vote = async (req, res) => {
  try {
    const question_id = req.params.question_id;
    const { vote } = req.body;
    let upvoted = false;
    let downvoted = false;

    const foundQuestion = await Question.findById(question_id);
    upvoted = foundQuestion.upvotes.includes(req.user._id);
    downvoted = foundQuestion.downvotes.includes(req.user._id);

    let newQuestion;
    let message;
    let votes = foundQuestion.upvotes.length - foundQuestion.downvotes.length;

    if (vote && upvoted) {
      newQuestion = await Question.findByIdAndUpdate(question_id, {
        upvotes: foundQuestion.upvotes.filter((user_id) => user_id.toString() !== req.user._id.toString()),
      });
      message = "upvote removed";
      votes -= 1;
    } 
    else if (vote && !upvoted && !downvoted) {
      newQuestion = await Question.findByIdAndUpdate(question_id, {
        upvotes: [...foundQuestion.upvotes, req.user._id],
      });
      message = "upvote added";
      votes += 1;
    } 
    else if (!vote && downvoted) {
      newQuestion = await Question.findByIdAndUpdate(question_id, {
        downvotes: foundQuestion.downvotes.filter((user_id) => user_id.toString() !== req.user._id.toString()),
      });
      message = "downvote removed";
      votes += 1;
    } 
    else if (!vote && !downvoted && !upvoted) {
      newQuestion = await Question.findByIdAndUpdate(question_id, {
        downvotes: [...foundQuestion.downvotes, req.user._id],
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
