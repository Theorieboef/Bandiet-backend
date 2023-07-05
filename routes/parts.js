const express = require("express");
const { body, validationResult } = require("express-validator");
let router = express.Router();

// Parts Model
const Parts = require("../models/parts");

router.get("/", function (req, res, next) {
  Parts.find({}).sort({position:1})
    .then(
      (parts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          parts,
          msg: "success",
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/section/:id", function (req, res, next) {
  Parts.find({ sectionId: req.params.id }).sort({position:1})
    .then(
      (parts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          parts,
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
  body("sectionId").notEmpty().withMessage("Section Id cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Parts.create(req.body)
      .then(
        (part) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Part Created Successfully",
            part,
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
  Parts.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { returnDocument: "after" }
  )
    .then(
      (part) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Part Updated Successfully",
          part,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  Parts.findOneAndRemove({ _id: req.params.id })
    .then(
      (part) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          part,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/show/:id", function (req, res, next) {
  if(!req.params.id) {
    next("Something went wronk")
  }
  Parts.findById(req.params.id)
    .then(
      (parts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          parts,
          msg: "success",
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
module.exports = router;
