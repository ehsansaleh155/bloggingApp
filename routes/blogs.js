const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Author = require("../models/author");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

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
router.post("/", async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    // publishDate: new Date(req.body.publishDate), ??? NEEDS CONSIDERATION
    // commentCount: req.body.commentCount, ??? NEEDS CONSIDERATION
    description: req.body.description,
  });
  saveImage(blog, req.body.image);

  try {
    const newBlog = await blog.save();
    // res.redirect('blogs/${newBlog.id}');
    res.redirect("blogs");
  } catch {
    renderNewPage(res, blog, true);
  }
});

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

function saveImage(blog, imageEncoded) {
  if (imageEncoded == null) return;
  const image = JSON.parse(imageEncoded);
  if (image != null && imageMimeTypes.includes(image.type)) {
    blog.blogImage = new Buffer.from(image.data, "base64");
    blog.blogImageType = image.type;
  }
}

module.exports = router;
