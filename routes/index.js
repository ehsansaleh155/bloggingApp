const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router.get("/", async (req, res) => {
  let blogs;
  try {
    // blogs = await Blog.find().sort({ modifiedAt: "desc" }).limit(10).exec();
    blogs = await Blog.find();
  } catch {
    blogs = [];
  }
  res.render("index", { blogs: blogs });
});

module.exports = router;
