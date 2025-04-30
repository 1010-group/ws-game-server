const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png",
  },
  color: {
    type: String,
    required: false,
    default: "#000",
  },
  password: {
    type: String,
    required: true,
  }
});
module.exports = mongoose.model("wsgameuser", userSchema);
