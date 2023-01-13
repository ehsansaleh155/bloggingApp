const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  userInfo: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Blog",
  },
  // publishDate: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // },
});

module.exports = mongoose.model("Comment", commentSchema);
