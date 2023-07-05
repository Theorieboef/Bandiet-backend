const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Main schema for users
 */
const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Users = mongoose.model("Users", usersSchema);
module.exports = Users;
