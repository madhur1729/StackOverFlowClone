require("dotenv").config();
const express = require("express");
const app = express();

const User = require("./models/user.js");
const cors = require('cors');

const routes = require("./routes/index");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", routes);

const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => { console.log("Connected to MongoDB"); })
.catch((err) => console.log(err));

//app.get('/', (req, res) => { res.send('Welcome to IITG Stakoverflow API'); })
const PORT = process.env.PORT;
app.listen(process.env.PORT, () => { console.log(`Server running at ${PORT}`); });