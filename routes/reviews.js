var express = require("express");
var router = express.Router();
const Tenant = require("../models/Tenant");
const Review = require("../models/Review");
const Listing = require("../models/Listing")
var mongoose = require("mongoose") //must declare mongoose to use mongoose.Types.ObjectId

//why do we have to declare if already declared in app.js?

const isAuthenticated = require('../middleware/isAuthenticated')

//CREATE A REVIEW ON A SPECIFIC LISTING -- 'listings/:listingId'; we can only create a review on a listing
router.post("/listings/:listingId", isAuthenticated, (req, res, next) => {
  const { tenant, comment, stars } = req.body;

  Review.create({ tenant, comment, stars })
    .then((response) => {
      res.json(response); //newly created record; what we see in Postman
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});


//UPDATE A REVIEW (followed Yelp's pathing)
router.get("/:reviewId", isAuthenticated, (req, res, next) => {
  
  const { reviewId } = req.params;

  //check if the tenant exists
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

//Show the owner details of the review
Review.findById(reviewId)
.populate("tenant")
.then((review) => res.status(200).json(review))
.catch((error) => res.json(error));
});

router.put("/edit/:reviewId", (req, res, next) => {
const { reviewId } = req.params;

if (!mongoose.Types.ObjectId.isValid(reviewId)) {
res.status(400).json({ message: "Specified id is not valid" });
return;
}

Review.findByIdAndUpdate(reviewId, req.body, { new: true })
.then((updatedReview) => {
    res.json(updatedReview)
})
.catch((error) => res.json(error));
});

//DELETE A REVIEW 
router.delete("/delete/:reviewId", isAuthenticated, (req, res, next) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Review.findByIdAndRemove(reviewId)
    .then((deleted) =>
      res.json({
        deleted,
        message: `Review with ${reviewId} has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});



module.exports = router;
