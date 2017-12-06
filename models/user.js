var mongoose = require("mongoose");
var passortLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model("User", UserSchema);