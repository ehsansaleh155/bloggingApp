const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Author = require("../models/author");
const Comment = require("../models/comment");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// All Blogs Route
router.get("/", async (req, res) => {
  let query = Blog.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  try {
    const blogs = await query.exec();
    res.render("blogs/index", {
      blogs: blogs,
      searchOptions: req.query,
    });
  } catch (e) {
    console.log(e);
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
    content: req.body.content,
    author: req.body.author,
  });
  saveCover(blog, req.body.cover);
  try {
    const newBlog = await blog.save();
    res.redirect(`blogs/${newBlog.id}`);
  } catch (e) {
    console.log(e);
    renderNewPage(res, blog, true);
  }
});

// Show Blog Route
router.get("/:id", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).populate("author").exec();
    blog.views++;
    const comments = await Comment.find({ blog: blog.id }).limit(10).exec();
    res.render("blogs/show", { blog: blog, commentsForBlog: comments });
    await blog.save();
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

// Edit Blog Route
router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    renderEditPage(res, blog);
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

// Update Blog Route
router.put("/:id", async (req, res) => {
  let blog;

  try {
    blog = await Blog.findById(req.params.id);
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = req.body.author;
    blog.views++;
    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(blog, req.body.cover);
    }
    await blog.save();
    res.redirect(`/blogs/${blog.id}`);
  } catch (e) {
    console.log(e);
    if (blog != null) {
      renderEditPage(res, blog, true);
    } else {
      redirect("/");
    }
  }
});

// Delete Blog Page
router.delete("/:id", async (req, res) => {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
    await blog.remove();
    res.redirect("/blogs");
  } catch (e) {
    console.log(e);
    if (blog != null) {
      res.render("blogs/show", {
        blog: blog,
        errorMessage: "Could not remove blog",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, blog, hasError = false) {
  renderFormPage(res, blog, "new", hasError);
}

async function renderEditPage(res, blog, hasError = false) {
  renderFormPage(res, blog, "edit", hasError);
}

async function renderFormPage(res, blog, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      blog: blog,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Blog";
      } else {
        params.errorMessage = "Error Creating Blog";
      }
    }
    res.render(`blogs/${form}`, params);
  } catch (e) {
    console.log(e);
    res.redirect("/blogs");
  }
}

function saveCover(blog, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    blog.coverImage = new Buffer.from(cover.data, "base64");
    blog.coverImageType = cover.type;
  }
}

module.exports = router;
