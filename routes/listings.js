var express = require("express");
var router = express.Router();
const Listing = require("../models/Listing")
// var mongoose = require("mongoose") no need to require on route; already required on the model

const isAuthenticated = require('../middleware/isAuthenticated')

//PULL ALL LISTINGS (placeholder)
router.get("/", isAuthenticated, (req, res, next) => {
  Listing.find() //find everything so empty parentheses
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
});

//PULL DETAILS OF SINGLE LISTING
router.get('/details/:listingId', isAuthenticated, (req, res, next) => {

  Listing.findById(req.params.listingId)//listing id
  .populate({
    path: 'reviews', 
    populate: {path: 'tenant'}
})
  .then((response) => {
    res.json(response)
  })
  .catch((err) => {
    console.log(err);
    res.json(err);
    next(err);
  });

})

module.exports = router;