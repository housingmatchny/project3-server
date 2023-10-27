//likes route
//profile page: show all the liked listings + unlike
//single listing: like / unlike
const jwt = require("jsonwebtoken");

var express = require('express');
var router = express.Router();
const Tenant = require('../models/Tenant')
const Listing = require('../models/Listing')

const isAuthenticated = require('../middleware/isAuthenticated')


router.get('/add-like/:id', isAuthenticated, function(req, res, next) {
  
    Listing.findByIdAndUpdate(
        //add like to listing
        req.params.id,//listingid pulled from params of request
        {
            $addToSet: {likes: req.tenant._id}
        },
        {new: true}
    )
    .then((updatedListing) => {
    //add listing id to array of liked listings on tenant document
        Tenant.findByIdAndUpdate(
            req.tenant._id,
            {
                $addToSet: {likes: req.params.id}
            },
            {new: true}
        )
        .populate('likes listings reviews') //add reviews when registered
        .then((updatedTenant) => {

            const { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, likes, reviews, listings } = updatedTenant;

            // Create an object that will be set as the token payload
            const payload = { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, likes, reviews, listings };
    
            // console.log("checking payload ==>", payload)
    
            // Create and sign the token
            const authToken = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "6h",
            });

            res.json({listing: updatedListing, user: updatedTenant, authToken})
            
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })

    })
    .catch((err) => {
        console.log(err)
        res.json(err)//shows error in browser and ends the request with a response
    })

});

router.get('/remove-like/:id', isAuthenticated, function(req, res, next) {
  
    Listing.findByIdAndUpdate(
        req.params.id,//listingid pulled from params of request
        {
            $pull: {likes: req.tenant._id}
        },
        {new: true}
    )
    .then((updatedListing) => {
    //add listing id to array of liked listings
        Tenant.findByIdAndUpdate(
            req.tenant._id,
            {
                $pull: {likes: req.params.id}
            },
            {new: true}
        )
        .populate('likes listings reviews') //add reviews when registered
        .then((updatedTenant) => {

            const { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, likes, reviews, listings } = updatedTenant;

            // Create an object that will be set as the token payload
            const payload = { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, likes, reviews, listings };
    
            // console.log("checking payload ==>", payload)
    
            // Create and sign the token
            const authToken = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "6h",
            });

            res.json({listing: updatedListing, user: updatedTenant, authToken})
            
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })

    })
    .catch((err) => {
        console.log(err)
        res.json(err)//shows error in browser and ends the request with a response
    })

});

module.exports = router;