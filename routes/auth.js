var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Tenant = require("../models/Tenant");

const isAuthenticated = require('../middleware/isAuthenticated')

const saltRounds = 10;

//SIGNUP
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if the email or password or name is provided as an empty string
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Please fill in all the fields" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

  // Check the tenant collection if a user with the same email already exists
  Tenant.findOne({ email })
    .then((foundTenant) => {
      // If the tenant with the same email already exists, send an error response
      if (foundTenant) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new tenant in the database
      // We return a pending promise, which allows us to chain another `then`
      Tenant.create({ email, password: hashedPassword, name })   
        .then((createdTenant) => {
          // Deconstruct the newly created user object to omit the password
          // We should never expose passwords publicly
          const { email, name, _id } = createdTenant;

          // Create a new object that doesn't expose the password  -- why do we not send the other info, like favs, image, and reviews, in the payload? b/c we do not have the information yet; they just signed up! smaller payload sizes can also lead to faster authentication
          const payload = { _id, email, name };

          // Create and sign the token
          const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
  
          // Send the token as the response
          res.status(200).json({ authToken });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

//SIGNIN
router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Please fill in all fields." });
    return;
  }

  // Check the tenant's collection if a user with the same email exists
  Tenant.findOne({ email })
    // .populate('tenants')
    .then((foundTenant) => {
      if (!foundTenant) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundTenant.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, reviews, listings } = foundTenant;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, image, about, boroughPreference, maxPrice, beds, baths, householdSize, pets, program, programAmt, creditScore, annualIncome, employmentStatus, moveInDate, viewingAvailability, reviews, listings };

        // console.log("checking payload ==>", payload)

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate. Please try again." });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

//VERIFY: for seeing the payload.  Long form: this route is for us to test that the token is valid and the info has been decoded and made available on the payload. 
//router.get - GET method on Express.js Router object that handles incoming GET requests to the verify path
router.get('/verify', isAuthenticated, (req, res, next) => {
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log("req.tenant", req.tenant); //from the isAuthenticated middleware
   
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.tenant);
  });

//LOGOUT, or do we do this on frontend?


module.exports = router;