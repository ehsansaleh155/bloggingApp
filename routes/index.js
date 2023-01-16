const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router.get("/", async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find().sort({ publishDate: "desc" }).limit(10).exec();
    // blogs = await Blog.find();
  } catch (e) {
    console.log(e);
    blogs = [];
  }
  res.render("index", { blogs: blogs });
});

module.exports = router;
