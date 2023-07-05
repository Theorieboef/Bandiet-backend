const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for results
 */
const resultsSchema = new Schema(
  {
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Results = mongoose.model("Results", resultsSchema);
module.exports = Results;
