var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


//==========================
//      AUTH ROUTES
//==========================

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});//,register provided by the plm package. The newUser will have a new username assigned 
    User.register(newUser, req.body.password, function(err, user){ //here the new userUse with username is passed with password
        if(err){ // the 'user' will be the newly created user
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds"); 
        });
    });
});

//Login Route
//show login form
router.get("/login", function(req, res){
    res.render("login");
})

//handle login logic
//app.post("/login", middleware, callback)
router.post("/login",passport.authenticate("local", //passport used as a middleware to authenticate the username and password
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res){
    
});

//logout route
router.get("/logout", function(req,res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});

module.exports = router;