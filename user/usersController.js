const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
        res.render("admin/users/create")
});

router.post("/users/create", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined) {

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            User.create({
                name: name,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/");
            });

        }else {
            res.redirect("/admin/users/create")
        }
    });

})

router.get("/login", (req, res) =>{
    res.render("admin/users/login")
});

router.post("/authenticate", (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){
            
            var correct = bcrypt.compareSync(password,user.password);
            
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/backlog")
            } else {
                res.redirect("/login");
            }

        } else {
            res.redirect("/");
        }

    });

});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});


module.exports = router;