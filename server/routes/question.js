const router = require("express").Router();
const question = require("../controllers/question");
const user = require("../controllers/user");
const auth = require("../controllers/auth");

router.get("/", question.getAllQuestions);
router.get("/top", question.getTopQuestions);
router.get("/topTags", question.getTopTags);
router.post("/tags/:pathname", question.getQuestionsTags);
router.post("/ask", auth.authCheck, user.findUser, question.createQuestion);
router.get("/:question_id", question.getQuestion);
router.patch("/:question_id", [auth.authCheck, user.findUser], question.updateQuestion);
router.delete("/:question_id", auth.authCheck, user.findUser, question.deleteQuestion);
router.patch("/vote/:question_id", auth.authCheck, user.findUser, question.vote);
router.post("/answers/:question_id", auth.authCheck, user.findUser, question.createAnswer);
router.get("/answers/:question_id", question.getAllAnswers);

module.exports = router;
