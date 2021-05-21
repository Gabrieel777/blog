const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesControll = require("./categories/CategoriesController");
const articlesControll = require("./articles/ArticlesController");
const usersControll = require("./user/usersController");
const backofficeControll = require("./backoffice/backofficeController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/user");


// - view emgine -

app.set("view engine", "ejs");

// Sessions

app.use(session({
    secret: "asaijsadhds", cookie: {maxAge: 300000000}
}))

// - static - 

app.use(express.static("public"));

// - BodyParser - 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// - Database -

connection
    .authenticate()
    .then( () => {
        console.log("- successful connection to the database -");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/", backofficeControll);
    
app.use("/", categoriesControll);

app.use("/", articlesControll);

app.use("/", usersControll);


app.get("/", (req, res) => {
    
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });

    });
    
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug 
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/");
    });

});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include:[{model: Article}]
    }).then( category => {
        if(category != undefined) {

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories} )
            });

        }else{
            res.redirect("/")
        };
    }).catch(err => {
        res.redirect("/");
     })

});

app.listen(4000, () => {
    console.log("- server running successfully -");
});

