//One-time pull from Rapid API; set it up here as a route rather than in the bin folder; unfortunately, there was no data to pull from
//added async function; must have await wrapped in an async function
//we also declared the route and router in app.js



var express = require("express");
var router = express.Router();
var axios = require("axios");
const Listing = require("../../models/Listing");

router.get("/", async (req, res, next) => {
  const options = {
    method: "GET",
    url: "https://realty-in-us.p.rapidapi.com/properties/list-for-rent",
    params: {
      state_code: "NY",
      city: "New York City",
      limit: "200",
      offset: "0",
      sort: "relevance",
    },
    headers: {
      "X-RapidAPI-Key": "0df301ad5cmsh7b5fbbf0cf12f6ap165d09jsnf8455c0615ac",
      "X-RapidAPI-Host": "realty-in-us.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(options);
    console.log("Response", response.data);//response.data is the data of the response; the Rapid API showed an example response of the data; that's how we obtained the listings property

    let listings = response.data.listings.map((listing) => {
      const {
        listing_id,
        prop_type,
        address,
        price,
        beds,
        baths,
        lat,
        lon,
        pet_policy,
        photo,
      } = listing;
      //per the API example response, the output is an array of listing objects. Here, we destructure the specific properties out of each listing object; we are not reassigning here, only destructuring

      return {
        listing_id,
        prop_type,
        address,
        price,
        beds,
        baths,
        lat,
        lon,
        pet_policy,
        photo,
      }; //here, we return a listing object with only the properties we've destructured; 'return listing' would have returned the specific properties and more which we do not want
    });

    // const {
    //   listing_id,
    //   prop_type,
    //   address,
    //   price,
    //   beds,
    //   baths,
    //   lat,
    //   lon,
    //   pet_policy,
    //   photo,
    // } = response.data; //destructure out of response.data; this was what we did originally but it would not have worked b/c response.data is an array of listing objects. We cannot destructure directly out of response.data; we have to map through it to get to the level of the listing objects

    Listing.insertMany(listings)
      .then((createdListing) => {
        console.log("Created listing ==>", createdListing);
        res.json(createdListing);
      })
      .catch((err) => {
        console.log(err)
      }) //catch block for the insertMany method
  } catch (err) {
    console.error(err);
    res.json(err);
    next(err);
  } //catch block for the try block i.e., if the axios request does not work
});

module.exports = router;
