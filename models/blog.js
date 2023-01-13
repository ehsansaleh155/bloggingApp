const mongoose = require("mongoose");
// const Comment = require("./comment");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  blogImage: {
    type: Buffer,
    required: true,
  },
  blogImageType: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  // publishDate: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // },
  // commentCount: {
  //   type: Number,
  //   required: true,
  // },
  // modifiedAt: {
  //   type: Date,
  //   required: true,
  //   default: Date.now,
  // },
});

blogSchema.virtual("blogImagePath").get(function () {
  if (this.blogImage != null && this.blogImageType != null) {
    return `data:${
      this.blogImageType
    };charset=utf-8;base64,${this.blogImage.toString("base64")}`;
  }
});

/* CHEEEEEECK BESHE
blogSchema.pre("remove", function (next) {
  Comment.find({ blog: this.id }, (err, comments) => {
    if (err) {
      next(err);
    } else if (comments.length > 0) {
      next(new Error("This blog still has comment(s)!"));
    } else {
      next();
    }
  });
});
*/

module.exports = mongoose.model("Blog", blogSchema);
