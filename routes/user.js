const express = require("express");
const { model } = require("mongoose");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router.get("/signup",userController.renderSignupPage);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.renderLogin);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.get("/logout",userController.logout)

module.exports = router;