const { model } = require("mongoose");
const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReviews = async(req,res) =>{
    let listings = await listing.findById(req.params.id);

    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listings.review.push(newReview);

    await newReview.save();
    await listings.save();

    req.flash("success","New review created successfully");
    res.redirect(`/listings/${listings.id}`);
}

module.exports.destoryReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
}