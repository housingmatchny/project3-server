//user
//practice matching on borough or maxPrice

const { Schema, model } = require("mongoose");
// destructure Schema and model out of mongoose and create a model below: mongoose.model(name, schema); no need for mongoose b/c model has been destructured out

const tenantSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    image: {
      type: String,
      default:
        "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg",
    },
    about: {
        type: String,
        maxLength: 500,
        },
    boroughPreference: {
        type: String,
        enum: ["Staten Island", "Manhattan", "Bronx", "Brooklyn", "Queens"],
        },
    maxPrice: Number,
    beds: Number,
    baths: Number,
    householdSize: Number,
    pets: Number,
    program: {
        type: String,
        enum: ["CityFHEPS", "FHEPS", "HASA", "Rapid Re-housing"],
        },
    programAmt: Number,
    creditScore: Number,
    annualIncome: Number,
    employmentStatus: {
        type: String,
        enum: [
            "Working full-time",
            "Working part-time",
            "Enrolled in a job training program",
            "Waiting for work authorization",
            "Other",
          ],
        },
    moveinDate: {
        type: String,
        default: "ASAP",
        },
    viewingAvailability: {
        type: String,
        enum: [
            "Anytime",
            "Weekend mornings",
            "Weekend afternoons",
            "Weekend evenings",
            "Weekday mornings",
            "Weekday afternoons",
            "Weekday evenings",
          ],
        },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }], //1:many, rated listings
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], //1:many
    listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }], //1:many, matched listings
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tenant", tenantSchema);

//reviews: values in the array of reviews will be object ids, not the actual reviews, that belong to the documents created based on the Review model.
