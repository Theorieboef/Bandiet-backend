const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for quizes
 */
const quizesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

quizesSchema.virtual("sections", {
  ref: "Sections",
  foreignField: "quizId",
  localField: "_id",
});

var Quizes = mongoose.model("Quizes", quizesSchema);
module.exports = Quizes;
