const router = require("express").Router();
const user = require("../controllers/user");
const auth = require("../controllers/auth");

router.get("/", user.getAllUsers);
router.get("/:user_id", user.getUser);
router.patch("/:user_id", auth.authCheck, user.findUser, user.updateUser);

module.exports = router;
