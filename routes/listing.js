const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const {isLoggedIn , isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



const listingController = require("../controllers/listings.js");

// index route
router.get("/", wrapAsync( listingController.index));

//new route
router.get("/new", isLoggedIn,listingController.renderNewform);

// show route
router.get("/:id",  wrapAsync(listingController.ShowRouteListing));

//create route
router.post("/", isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync( listingController.listingCreateRoute));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.listingEditRoute ));

// update route
router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync( listingController.listingUpdateRoute));

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.listingDestoryRoute));

module.exports = router;