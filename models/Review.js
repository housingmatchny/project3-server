//reviews

const { Schema, model } = require('mongoose')

const reviewSchema = new Schema(
    {
        tenant: {type: Schema.Types.ObjectId, ref: 'Tenant'},//1:1, every review has one owner
        comment: {
            type: String,
            maxLength: 200
        },//1:1, every review has one comment
        stars: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },//1:1, every review has one star rating
        listings: {type: Schema.Types.ObjectId, ref: 'Listing'}//every review is specific to one listing
    },
    {
        timestamps: true
    }
)

module.exports = model("Review", reviewSchema);