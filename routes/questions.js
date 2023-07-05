const express = require("express");
const { body, validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
let router = express.Router();

// Questions Model
const Questions = require("../models/questions");

router.get("/", function (req, res, next) {
  Questions.find({})
    .then(
      (questions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          questions,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/part/:id", function (req, res, next) {
  Questions.find({ partId: req.params.id })
    .then(
      (questions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "success",
          questions,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// router.post(
//   '/',
//   // body("question").notEmpty().withMessage("Question cannot be empty"),
//   body('partId').notEmpty().withMessage('Part Id cannot be empty'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     if (
//       !req.body?.question &&
//       !(req?.files && Object.keys(req?.files)?.length)
//     ) {
//       return res
//         .status(400)
//         .json({ errors: 'Question and image cannot be empty' });
//     }
//     let body = {
//       ...req.body,
//     };
//     let sampleFile;
//     let uploadPath;
//     let fileName;
//     if (req?.files && Object.keys(req?.files)?.length) {
//       sampleFile = req.files.image;
//       fileName = `${new Date().getTime().toString()}${sampleFile.name}`;
//       uploadPath = `${__dirname}/../upload/${fileName}`;

//       sampleFile.mv(uploadPath, function (err) {
//         if (err) return res.status(500).send(err);
//       });
//       body.image = `${process.env.SERVER_URI}/upload/${fileName}`;
//     }

//     Questions.create(body)
//       .then(
//         (question) => {
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'application/json');
//           res.json({
//             msg: 'Question Created Successfully',
//             question,
//           });
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   }
// );

router.post(
  "/",
  body("partId").notEmpty().withMessage("Part Id cannot be empty"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (
      !req.body?.question &&
      !(req?.files && Object.keys(req?.files)?.length)
    ) {
      return res
        .status(400)
        .json({ errors: "Question and image cannot be empty" });
    }
    let body = {
      ...req.body,
    };
    let sampleFile;
    let fileName;
    if (req?.files && Object.keys(req?.files)?.length) {
      sampleFile = req.files.image;
      // fileName = `${new Date().getTime().toString()}${sampleFile.name}`;

      // Upload the image to Cloudinary
      let cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          // public_id: fileName,
          folder: "question_images", // optional, replace with the name of your Cloudinary folder
        },
        (error, result) => {
          if (error) return res.status(500).send(error);
          else {
            body.image = result.secure_url; // store the url of the uploaded image in the body
            body.imagePublicId = result.public_id;

            Questions.create(body)
              .then(
                (question) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    msg: "Question Created Successfully",
                    question,
                  });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        }
      );

      // Convert the image data to a stream and pipe it to Cloudinary upload stream
      streamifier.createReadStream(sampleFile.data).pipe(cld_upload_stream);
    }
  }
);

// router.patch("/:id", (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   let body = {
//     ...req.body,
//   };
//   let sampleFile;
//   let uploadPath;
//   let fileName;

//   if (req?.files && Object.keys(req?.files)?.length) {
//     sampleFile = req.files.image;
//     fileName = `${new Date().getTime().toString()}${sampleFile.name}`;
//     uploadPath = `${__dirname}/../upload/${fileName}`;

//     sampleFile.mv(uploadPath, function (err) {
//       if (err) return res.status(500).send(err);
//     });
//     body.image = `${process.env.SERVER_URI}/upload/${fileName}`;
//   }
//   Questions.findByIdAndUpdate(
//     req.params.id,
//     { $set: body },
//     { returnDocument: "after" }
//   )
//     .then(
//       (question) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json({
//           msg: "Question Updated Successfully",
//           question,
//         });
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// });

router.patch("/:id", async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let body = {
    ...req.body,
  };
  let sampleFile;

  if (req?.files && Object.keys(req?.files)?.length) {
    sampleFile = req.files.image;

    // Upload the image to Cloudinary
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "question_images", // optional, replace with the name of your Cloudinary folder
      },
      (error, result) => {
        if (error) return res.status(500).send(error);
        else {
          body.image = result.url; // store the url of the uploaded image in the body

          Questions.findByIdAndUpdate(
            req.params.id,
            { $set: body },
            { returnDocument: "after", new: true }
          )
            .then(
              (question) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  msg: "Question Updated Successfully",
                  question,
                });
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      }
    );

    // Convert the image data to a stream and pipe it to Cloudinary upload stream
    streamifier.createReadStream(sampleFile.data).pipe(cld_upload_stream);
  } else {
    Questions.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { returnDocument: "after", new: true }
    )
      .then(
        (question) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            msg: "Question Updated Successfully",
            question,
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

router.delete("/:id", (req, res, next) => {
  Questions.findOneAndRemove({ _id: req.params.id })
    .then(
      (question) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: "Deleted Successfully",
          question,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
