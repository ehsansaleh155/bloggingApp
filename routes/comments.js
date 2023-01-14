const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");

// All Comments Route
router.get("/", async (req, res) => {
  let query = Comment.find();
  if (req.query.userInfo != null && req.query.userInfo != "") {
    query = query.regex("userInfo", new RegExp(req.query.userInfo, "i"));
  }
  try {
    const comments = await query.exec();
    res.render("comments/index", {
      comments: comments,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Comment Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Comment());
});

// Create Comment Route
router.post("/", async (req, res) => {
  const comment = new Comment({
    userInfo: req.body.userInfo,
    commentText: req.body.commentText,
    blog: req.body.blog,
  });
  try {
    const newComment = await comment.save();
    res.redirect(`comments/${newComment.id}`);
  } catch {
    renderNewPage(res, comment, true);
  }
});

// Show Comment Route
router.get("/:id", async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).populate("blog").exec();
    comment.views++;
    res.render("comments/show", { comment: comment }); // PROBABLY NEEDS TO CHANGE
    await comment.save();
  } catch {
    res.redirect("/");
  }
});

// Delete Comment page
router.delete("/:id", async (req, res) => {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    await comment.remove();
    res.redirect("/comments");
  } catch {
    if (comment != null) {
      res.render("comments/show", {
        // PROBABLY NEEDS TO CHANGE
        comment: comment,
        errorMessage: "Could not remove comment",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, comment, hasError = false) {
  try {
    const blogs = await Blog.find({});
    const params = {
      blogs: blogs,
      comment: comment,
    };
    if (hasError) {
      params.errorMessage = "Error Creating Comment";
    }
    res.render(`comments/new`, params);
  } catch {
    res.redirect("/comments");
  }
}

module.exports = router;
