const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const user = new mongoose.Schema({
	name: { type: String, unique: true, required: [true, "Username"], },
	email: { type: String, required: [true, "Email ID"], unique: true, validate: [isEmail, "Please enter a valid email"], },
	password: { type: String, required: [true, "Password length must be atleast 6 characters"], minlength: [6, "Password length must be atleast 6 characters"], },
	answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer", }],
	questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", }],
}, { timestamps: true, });

user.plugin(uniqueValidator);

user.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

user.methods.comparePasswords = function (password, callback) {
	bcrypt.compare(password, this.password, function (error, match) {
		if (error) return callback(error);
		return callback(null, match);
	});
};

module.exports = mongoose.model("User", user);

