const express = require("express");
const { body, validationResult } = require("express-validator");
let router = express.Router();

// Results Model
const Results = require("../models/results");

router.get("/", function (req, res, next) {
  Results.find({})
    .then(
      (results) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          results,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post(
  "/",
  body("data").notEmpty().withMessage("data cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Results.create(req.body)
      .then(
        (result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Result Created Successfully",
            result,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.delete("/:id", (req, res, next) => {
  Results.findOneAndRemove({ _id: req.params.id })
    .then(
      (result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          result,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
