const mongoose = require("mongoose");

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
  blogImage: {
    type: Buffer,
    required: true,
  },
  blogImageType: {
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
  if (this.blogImage != null && this.blogImageType != null) {
    return `data:${
      this.blogImageType
    };charset=utf-8;base64,${this.blogImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Blog", blogSchema);
