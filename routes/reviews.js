const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewsControllers = require("../controllers/reviews.js");


//post route

router.post("/",isLoggedIn,validateReview, wrapAsync( reviewsControllers.createReviews));

//delete review route

router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewsControllers.destoryReviews));

module.exports = router;