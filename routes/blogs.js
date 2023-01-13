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
    content: req.body.content,
    author: req.body.author,
  });
  saveImage(blog, req.body.image);
  try {
    const newBlog = await blog.save();
    res.redirect(`blogs/${newBlog.id}`);
  } catch {
    renderNewPage(res, blog, true);
  }
});

// Show Blog Route
router.get("/:id", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).populate("author").exec();
    blog.views++;
    res.render("blogs/show", { blog: blog });
    await blog.save();
  } catch {
    res.redirect("/");
  }
});

// Edit Blog Route
router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    renderEditPage(res, blog);
  } catch {
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
    if (req.body.image != null && req.body.image !== "") {
      saveImage(blog, req.body.image);
    }
    await blog.save();
    res.redirect(`/blogs/${blog.id}`);
  } catch {
    if (blog != null) {
      renderEditPage(res, blog, true);
    } else {
      redirect("/");
    }
  }
});

// Delete Blog page
router.delete("/:id", async (req, res) => {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
    await blog.remove();
    res.redirect("/blogs");
  } catch {
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
