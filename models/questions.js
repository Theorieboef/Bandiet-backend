const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for questions
 */
const questionsSchema = new Schema(
  {
    question: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    feedback: {
      type: String,
      required: false,
    },
    partId: {
      type: [{ type: mongoose.ObjectId, ref: "Parts" }],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

questionsSchema.virtual("answers", {
  ref: "Answers",
  foreignField: "questionId",
  localField: "_id",
});

var Questions = mongoose.model("Questions", questionsSchema);
module.exports = Questions;
