const express = require("express");
const { body, validationResult } = require("express-validator");
let router = express.Router();

// Sections Model
const Sections = require("../models/sections");

router.get("/", function (req, res, next) {
  Sections.find({})
    .then(
      (sections) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          sections,
          msg: "success",
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/quiz/:id", function (req, res, next) {
  Sections.find({ quizId: req.params.id })
    .then(
      (sections) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          sections,
          msg: "success",
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post(
  "/",
  body("title").notEmpty().withMessage("Title cannot be empty"),
  body("position").notEmpty().withMessage("Position cannot be empty"),
  body("quizId").notEmpty().withMessage("Quiz Id cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Sections.create(req.body)
      .then(
        (section) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Section Created Successfully",
            section,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.patch("/:id", (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Sections.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { returnDocument: "after" }
  )
    .then(
      (section) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Section Updated Successfully",
          section,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  Sections.findOneAndRemove({ _id: req.params.id })
    .then(
      (section) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          section,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
