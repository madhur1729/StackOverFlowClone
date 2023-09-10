const router = require("express").Router();
const answer = require("../controllers/answer");
const user = require("../controllers/user");
const auth = require("../controllers/auth");

router.patch("/:answer_id", auth.authCheck, user.findUser, answer.updateAnswer);
router.delete("/:answer_id", auth.authCheck, user.findUser, answer.deleteAnswer);
router.patch('/vote/:answer_id', auth.authCheck, user.findUser, answer.vote);

module.exports = router;