const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for answers
 */
const answersSchema = new Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: false,
      default: false,
    },
    questionId: {
      type: [{ type: mongoose.ObjectId, ref: "Questions" }],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Answers = mongoose.model("Answers", answersSchema);
module.exports = Answers;
