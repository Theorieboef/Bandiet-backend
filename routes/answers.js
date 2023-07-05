const express = require("express");
const { body, validationResult } = require("express-validator");
let router = express.Router();

// Answers Model
const Answers = require("../models/answers");

router.get("/", function (req, res, next) {
  Answers.find({})
    .populate("questionId")
    .then(
      (answers) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          answers,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/question/:id", function (req, res, next) {
  Answers.find({ questionId: req.params.id })
    .then(
      (answers) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          answers,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post(
  "/",
  body("answer").notEmpty().withMessage("Answer cannot be empty"),
  body("questionId").notEmpty().withMessage("Question Id cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Answers.create(req.body)
      .then(
        (answer) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Answer Created Successfully",
            answer,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.patch("/:id", async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.body?.isCorrect) {
    let ans = await Answers.findById(req.params.id);
    Answers.updateMany(
      {
        questionId: ans.questionId,
      },
      {
        $set: {
          isCorrect: false,
        },
      }
    ).then(() => {
      Answers.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { returnDocument: "after" }
      )
        .then(
          (answer) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              msg: "Answer Updated Successfully",
              answer,
            });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  } else {
    Answers.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" }
    )
      .then(
        (answer) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Answer Updated Successfully",
            answer,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

router.delete("/:id", (req, res, next) => {
  Answers.findOneAndRemove({ _id: req.params.id })
    .then(
      (answer) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          answer,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
