const express = require("express");
const router = express.Router();
const blog = require("../models/blog");

router.get("/", async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find().sort({ modifiedAt: "desc" }).limit(10).exec();
  } catch {
    blogs = [];
  }
  res.render("index");
});

module.exports = router;
