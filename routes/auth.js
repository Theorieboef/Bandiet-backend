const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let router = express.Router();

// Users Model
const Users = require("../models/users");

router.post("/login", (req, res) => {
  Users.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        res.status(404).json({ error: "no user with that email found" });
      else {
        console.log(user, "user", req.body.password, user.password, "password");
        bcrypt.compare(req.body.password, user.password, (error, match) => {
          if (error) res.status(500).json(error);
          else if (match)
            res.status(200).json({
              token: jwt.sign({ data: user }, "ex-theorie", {
                expiresIn: "24h",
              }),
              user,
            });
          else res.status(403).json({ error: "passwords do not match" });
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/signup", async (req, res) => {
  body("email").notEmpty().withMessage("Email cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
    bcrypt.hash(req.body.password, 10, (error, hash) => {
      console.log({ error });
      if (error) res.status(500).json(error);
      else {
        const newUser = Users({ email: req.body.email, password: hash });
        newUser
          .save()
          .then((user) => {
            res.status(200).json({ msg: "User Created Successfully", user });
          })
          .catch((error) => {
            console.log("===", error);
            res.status(500).json(error);
          });
      }
    });
});

router.get("/", function (req, res, next) {
  Users.find({})
    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          users,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  Users.findOneAndRemove({ _id: req.params.id })
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          user,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
