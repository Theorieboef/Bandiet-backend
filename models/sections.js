const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for sections
 */
const sectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    quizId: {
      type: [{ type: mongoose.ObjectId, ref: "Quizes" }],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

sectionSchema.virtual("parts", {
  ref: "Parts",
  foreignField: "sectionId",
  localField: "_id",
});

var Sections = mongoose.model("Sections", sectionSchema);
module.exports = Sections;
