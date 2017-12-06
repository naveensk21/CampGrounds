var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");



//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author={
                id: req.user._id,
                username: req.user.username
                } //create an object
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "New Campground Successfully Created")
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE - FORM and need update to submit the form
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    //check is someone logged in at all?
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function (req, res){
    //find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){//id, the data u wanna update, and callback function
        if (err){
            res.redirect("/campgrounds");
        } else{
            //redirect to the show page
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/campgrounds");     
         } else {
             req.flash("succes", "Campground: " + Campground.name + " Successfully Deleted");
             res.redirect("/campgrounds");
         }
    });
});


//only allow a logged in user to add a comment 
//middelware




// function checkCampgroundOwnership (req, res, next){
//     if (req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//         if (err){
//             res.redirect("back");
//         } else {
//         // another if statment to check if the user own the campground?
//           if(foundCampground.author.id.equals(req.use._id)){
//                 next();
//           } else {
//                 res.redirect("back");
//           }
//         }
//         });
//     } else{
//         res.redirect("back");
//     }
// }


module.exports = router;