const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const User = require("../user/user");

router.get("/admin/backlog", adminAuth, (req, res) => {
    res.render("admin/backlog/backlog")
});

router.post("/joinCategories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/joinArticles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    });
});

router.post("/joinUsers", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

module.exports = router;