//Tenant Profile Page + links to personal page and preferences page

var express = require("express");
var router = express.Router();
const Tenant = require("../models/Tenant");

const isAuthenticated = require("../middleware/isAuthenticated");

const jwt = require("jsonwebtoken");


//GET TENANT PROFILE
router.get("/:tenantId", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  // //check if the tenant exists; not necessary
  // if (!mongoose.Types.ObjectId.isValid(tenantId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Tenant.findById(tenantId)
    .populate("likes listings") //.populate("reviews likes listings") only after those collections are registered; populating before any data exists will cause errors
    .populate({
      path: "reviews",
      populate: {
        path: "listing",
        populate: {path: 'reviews'}
      }
    })
    .populate({
      path: "likes",
      populate: { path: "reviews" }
    })
    .then((populatedProfile) => {
      const { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, reviews, likes, listings } = populatedProfile;

      // Create an object that will be set as the token payload
      const payload = { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, reviews, likes, listings };

      // console.log("checking payload ==>", payload)

      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      
      res.status(200).json({user: populatedProfile, authToken})

    })
    .catch((error) => res.json(error));
});

//UPDATE PREFERENCES PAGE
router.put("/preferences/:tenantId", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  Tenant.findByIdAndUpdate(tenantId, req.body, { new: true })
    .then((updatedPrefs) => {
      res.json(updatedPrefs);
    })
    .catch((error) => res.json(error));
});

//UPDATE PERSONAL PAGE
router.put("/personal/:tenantId", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  Tenant.findByIdAndUpdate(tenantId, req.body, { new: true })
    .then((updatedPersonalInfo) => {
      res.json(updatedPersonalInfo);
    })
    .catch((error) => res.json(error));
});

//DELETE ACCOUNT from PERSONAL PAGE
router.delete("/delete/personal/:tenantId", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  Tenant.findByIdAndRemove(tenantId)
    .then((deleted) =>
      res.json({
        deleted,
        message: `Tenant Profile with ${tenantId} has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
