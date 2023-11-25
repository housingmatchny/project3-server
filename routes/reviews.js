var express = require("express");
var router = express.Router();
const Tenant = require("../models/Tenant");
const Review = require("../models/Review");
const Listing = require("../models/Listing");

const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/isAuthenticated");

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

// PULL REVIEWS BY REVIEW ID
router.get("/:reviewId", isAuthenticated, (req, res, next) => {
  Review.findById(req.params.reviewId)
    .populate("listing")
    .then((foundReview) => {
      console.log("Found review==>", foundReview);
      res.json(foundReview);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

//ADD AND SAVE NEW REVIEW to database  -- not this route: /listings/details/:listingId/add-review
router.post("/add-review", isAuthenticated, async (req, res, next) => {
  try {
    let createdReview = await Review.create(req.body);

    let firstChangedListing = await Listing.findByIdAndUpdate(
      req.body.listing,
      {
        $push: { reviews: createdReview._id },
      },
      { new: true }
    );

    let populatedListing = await firstChangedListing.populate("tenant");

    let updatedListing = await populatedListing.populate({
      path: "reviews",
      populate: { path: "tenant" },
    });

    let updatedTenant = await Tenant.findByIdAndUpdate(
      req.tenant._id,
      {
        $push: { reviews: createdReview._id },
      },
      { new: true }
    );

    res.status(200).json({ createdReview, updatedListing, updatedTenant });
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
});
// router.get("/:reviewId", isAuthenticated, (req, res, next) => {

//   Review.findById(req.params.reviewId)
//   .populate("listing")
//   .then((foundReview) => {
//     console.log("Found review==>", foundReview)
//     res.json(foundReview)
//   })
//   .catch((err) => {
//     console.log(err)
//     res.json(err)
//     next(err)
//   })
// })

// //ADD AND SAVE NEW REVIEW to database  -- not this route: /listings/details/:listingId/add-review
// router.post('/add-review', isAuthenticated, (req, res, next) => {
//   Review.create(req.body)
//   .then((createdReview) => {

//     Listing.findByIdAndUpdate(
//       req.body.listing,
//       {
//         $push: {reviews: createdReview._id}
//       },
//       {new: true}
//     )
//     .then((updatedListing) => {

//       Tenant.findByIdAndUpdate(
//         req.tenant._id,
//         {
//           $push: {reviews: createdReview._id}
//         },
//         {new: true}
//       )
//       .then((updatedTenant) => {
//               console.log("Updates==>", createdReview, updatedListing, updatedTenant)
//               res.status(200).json({createdReview, updatedListing, updatedTenant});//if successful, return a json response with a 200 status code
//       })
//       .catch((err) => {
//         console.log(err)
//         res.json(err)
//         next(err);
//       })
//     })
//     .catch((err) => {
//       console.log(err)
//       res.json(err)
//       next(err);
//     })
//   })
//   .catch((err) => {
//     console.log(err)
//     res.json(err)
//     next(err);
//   })
// })

//EDIT REVIEW and update in database
router.put("/edit-review/:reviewId", (req, res, next) => {
  // if review exists- no need to check b/c edit review only comes up for the owner

  Review.findByIdAndUpdate(req.params.reviewId, req.body, { new: true }) //two arguments with one optional: id, request body, 3rd optional (new: true - shows what has been updated)
    .then((updatedReview) => {
      Listing.findById(updatedReview.listing)
        .populate("tenant")
        .populate({ path: "reviews", populate: { path: "tenant" } })
        .then((updatedListing) => {
          console.log("Updated review ==>", updatedReview);
          res.json({ updatedReview, updatedListing });
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

//PULL PREVIOUS REVIEW
//when we get a request a this url, this is how we handle it: we search for the specific review
router.get("/edit-review/:reviewId", isAuthenticated, (req, res, next) => {
  Review.findById(req.params.reviewId)
    .then((response) => {
      //is this the previous review?
      console.log("Previous review ==>", response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

//DELETE REVIEW and remove from database
router.delete(
  "/delete-review/:reviewId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      let deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
      let updatedTenant = await Tenant.findByIdAndUpdate(
        req.tenant._id,
        {
          $pull: { reviews: deletedReview._id },
        },
        { new: true }
      );

      let listingToUpdate = await Listing.findByIdAndUpdate(
        deletedReview.listing,
        {
          $pull: { reviews: deletedReview._id },
        },
        { new: true }
      );

      let firstPopulate = await listingToUpdate.populate("tenant");

      let updatedListing = await firstPopulate.populate({
        path: "reviews",
        populate: { path: "tenant" },
      });

      res.status(200).json({ deletedReview, updatedTenant, updatedListing });
    } catch (err) {
      console.log(err);
      res.json(err);
      next(err);
    }

    // let deletedReview = await Review.findByIdAndDelete(req.params.reviewId)

    //   .then((deletedReview) => {
    //     console.log("Successfully deleted ==>", deletedReview);
    //     res.json(deletedReview);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.json(err);
    //     next(err);
    //   });
  }
);

module.exports = router;
