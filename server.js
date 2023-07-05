const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const auth = require("./routes/auth");
const quizes = require("./routes/quizes");
const sections = require("./routes/sections");
const parts = require("./routes/parts");
const questions = require("./routes/questions");
const answers = require("./routes/answers");
const results = require("./routes/results");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

app.use(fileUpload());

// cors
app.use(cors());

app.use(morgan("dev"));

// DB config
const db = require("./config/keys").mongoURI;

mongoose.set("strictQuery", false);

// connet to mongo
mongoose
  .set("strictQuery", false)
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongo Connected..");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/upload", express.static("upload"));

// use routes
app.use("/api/auth", auth);
app.use("/api/quiz", quizes);
app.use("/api/section", sections);
app.use("/api/part", parts);
app.use("/api/question", questions);
app.use("/api/answer", answers);
app.use("/api/result", results);

app.get("/", (req, res) => {
  res.send("App is working");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
