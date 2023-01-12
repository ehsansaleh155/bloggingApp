const mongoose = require("mongoose");
const path = require("path");

const blogImageBasePath = "uploads/blogImages";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  commentCount: {
    type: Number,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  blogImageName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

blogSchema.virtual("blogImagePath").get(function () {
  if (this.blogImageName != null) {
    return path.join("/", blogImageBasePath, this.blogImageName);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
module.exports.blogImageBasePath = blogImageBasePath;
