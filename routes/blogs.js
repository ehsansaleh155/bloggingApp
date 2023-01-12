const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const Author = require("../models/author");
const uploadPath = path.join("public", Blog.blogImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// All Blogs Route
router.get("/", async (req, res) => {
  let query = Blog.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.lte("publishDate", req.query.publishedAfter);
  }
  try {
    const blogs = await query.exec();
    res.render("blogs/index", {
      blogs: blogs,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Blog Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Blog());
});

// Create Blog Route
router.post("/", upload.single("image"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    // publishDate: new Date(req.body.publishDate), ??? NEEDS CONSIDERATION
    // commentCount: req.body.commentCount, ??? NEEDS CONSIDERATION
    blogImageName: fileName,
    description: req.body.description,
  });
  try {
    const newBlog = await blog.save();
    // res.redirect('blogs/${newBlog.id}');
    res.redirect("blogs");
  } catch {
    if (blog.blogImageName != null) {
      removeBlogImage(blog.blogImageName);
    }
    renderNewPage(res, blog, true);
  }
});

function removeBlogImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, blog, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      blog: blog,
    };
    if (hasError) params.errorMessage = "Error Creating Blog";
    res.render("blogs/new", params);
  } catch {
    res.redirect("/blogs");
  }
}

module.exports = router;
