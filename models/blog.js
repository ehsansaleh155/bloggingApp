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
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
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

blogSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
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
