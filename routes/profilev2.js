var express = require("express");
var router = express.Router();
const Tenant = require("../models/Tenant");
const Review = require("../models/Review");
const Listing = require("../models/Listing")

const isAuthenticated = require('../middleware/isAuthenticated')


//PULL ALL REVIEWS
router.get("/", isAuthenticated, (req, res, next) => {
  Review.find() //find everything so empty parentheses
    .populate("tenant listing") //show tenant and listing info, not only the id's
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

//ADD AND SAVE NEW REVIEW to database  -- not this route: /listings/details/:listingId/add-review
router.post('/add-review', isAuthenticated, (req, res, next) => {
  Review.create(req.body) 
  .then((createdReview) => {

    Listing.findByIdAndUpdate(
      req.body.listing,
      {
        $push: {reviews: createdReview._id}
      },
      {new: true}
    )
    .then((updatedListing) => {

      Tenant.findByIdAndUpdate(
        req.tenant._id,
        {
          $push: {reviews: createdReview._id}
        },
        {new: true}
      )
      .then((updatedTenant) => {     
              console.log("Updates==>", createdReview, updatedListing, updatedTenant)
              res.status(200).json(createdReview, updatedListing, updatedTenant);//if successful, return a json response with a 200 status code
      })
      .catch((err) => {
        console.log(err)
        res.json(err)
        next(err);
      })
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
      next(err);
    })
  })
  .catch((err) => {
    console.log(err)
    res.json(err)
    next(err);
  })
})

//EDIT REVIEW and update in database
router.post('/edit-review/:reviewId', (req, res, next) => {
  // if review exists- no need to check b/c edit review only comes up for the owner

  Review.findByIdAndUpdate(req.params.reviewId, req.body, {new:true}) //two arguments with one optional: id, request body, 3rd optional (new: true - shows what has been updated)
  .then((updatedReview) => {
    console.log("Updated review ==>", updatedReview)
    res.json(updatedReview)
  })
  .catch((err) => {
    console.log(err);
    res.json(err);
    next(err);
  });

})
//DELETE REVIEW and remove from database
router.get('/delete-review/:reviewId', (req, res, next) => {
  
  Review.findByIdAndDelete(req.params.reviewId)
  .then((deletedReview) => {
    console.log("Successfully deleted ==>", deletedReview)
    res.json(deletedReview)
  })
  .catch((err) => {
    console.log(err);
    res.json(err);
    next(err);
  });

})

module.exports = router;
