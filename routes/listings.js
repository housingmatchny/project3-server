var express = require("express");
var router = express.Router();
const Review = require("../models/Review");
const Listing = require("../models/Listing")
var mongoose = require("mongoose") 

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

module.exports = router;