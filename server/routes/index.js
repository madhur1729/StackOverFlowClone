const router = require("express").Router();

const auth = require("../controllers/auth");

const question = require("./question");
const answer = require("./answer");
const user = require("./user");

router.use("/user", user);
router.use("/question", question);
router.use("/answer", answer);

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/auth", auth.authCheck, auth.loadUser);
router.delete("/logout", auth.logout);

module.exports = router;
