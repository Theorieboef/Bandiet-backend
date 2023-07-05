const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for parts
 */
const partSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text1: {
      type: String,
      required: false,
    },
    text2: {
      type: String,
      required: false,
    },
    position: {
      type: Number,
      required: true,
    },
    sectionId: {
      type: [{ type: mongoose.ObjectId, ref: "Sections" }],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

partSchema.virtual("questions", {
  ref: "Questions",
  foreignField: "partId",
  localField: "_id",
});

var Parts = mongoose.model("Parts", partSchema);
module.exports = Parts;
