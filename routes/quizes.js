const express = require("express");
const { body, validationResult } = require("express-validator");
let router = express.Router();

// Quizes Model
const Quizes = require("../models/quizes");
// Sections Model
const Sections = require("../models/sections");
// Parts Model
const Parts = require("../models/parts");
// Questions Model
const Questions = require("../models/questions");
// Answers Model
const Answers = require("../models/answers");

router.get("/", function (req, res, next) {
  Quizes.find({})
    .then(
      (quizes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          quizes,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/details/:id", function (req, res, next) {
  Quizes.findById(req.params.id)
    .populate({
      path: "sections",
      populate: {
        path: "parts",
        options: { sort: { position: 1 } },
        populate: {
          path: "questions",
          populate: {
            path: "answers",
          },
        },
      },
    })
    .then(
      (quiz) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          quiz,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post(
  "/",
  body("name").notEmpty().withMessage("Quiz Name cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Quizes.create(req.body)
      .then(
        (quiz) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Quiz Created Successfully",
            quiz,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.post("/add", async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
const counter = Number(await Quizes.countDocuments()) + 1;
  await Quizes.create({ name: `quiz ${counter}` })
    .then(
      async (quiz) => {
        let sections = [
          {
            title: "section 1",
            position: 1,
            quizId: quiz._id,
            parts: [
              {
                title: "Section 1 Part 1",
                position: 1,
                questions: 25,
              },
            ],
          },
          {
            title: "section 2",
            position: 2,
            quizId: quiz._id,
            parts: [
              {
                title: "Section 2 Part 1",
                position: 2,
                questions: 12,
              },
              {
                title: "Section 2 Part 2",
                position: 3,
                questions: 28,
              },
            ],
          },
        ];
        for (let i = 0; i < sections.length; i++) {
          Sections.create(sections[i]).then((section) => {
            for (let j = 0; j < sections[i].parts.length; j++) {
              Parts.create({
                ...sections[i].parts[j],
                sectionId: section._id,
              }).then((part) => {
                for (let k = 0; k < sections[i].parts[j].questions; k++) {
                  Questions.create({
                    question: "Question " + (+k + 1),
                    feedback: "feedback " + (+k + 1),
                    partId: part._id,
                  }).then(async (question) => {
                    await Answers.create({
                      answer: "wrong",
                      isCorrect: false,
                      questionId: question._id,
                    });
                    await Answers.create({
                      answer: "wrong",
                      isCorrect: false,
                      questionId: question._id,
                    });
                    await Answers.create({
                      answer: "wrong",
                      isCorrect: false,
                      questionId: question._id,
                    });
                    await Answers.create({
                      answer: "correct",
                      isCorrect: true,
                      questionId: question._id,
                    });
                  });
                  setTimeout(() => {
                    res.json({
                      msg: "Quiz Created Successfully",
                      data:quiz,
                    });
                  }, 8000);
                }
              });
            }
          });
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.patch("/:id", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Quizes.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { returnDocument: "after" }
  )
    .then(
      (quiz) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Quiz Updated Successfully",
          quiz,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  Quizes.findOneAndRemove({ _id: req.params.id })
    .then(
      (quiz) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          quiz,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
