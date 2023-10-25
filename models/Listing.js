//listings from CSV

const { Schema, model } = require('mongoose')

const listingSchema = new Schema(
    {
        tenant: [{type: Schema.Types.ObjectId, ref: 'Tenant'}],//many:many, every listing has multiple tenants and every tenant has multiple listings
        ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}],//1:many, every listing has multiple ratings!
        reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],//1:many, every listing can have multiple reviews
        propType: String,
        streetAddress: String,
        neighborhood: String,
        borough: String,
        zipCode: Number,
        beds: String,
        baths: String,
        lat: Number,
        lon: Number,
        price: Number,
        voucherReceptive: String,
        responsive: String,
        contactDate: String,
        listingSource: String,
        phone: String,
        imgUrl: {
            type: String,
            default: "https://www.trulia.com/pictures/thumbs_5/zillowstatic/fp/53c0c16fba4feec66b1ce21319310682-f_b.webp"
        }
        
        // tag: {
        //     type: String,
        //     enum: ["Vetted", null],
        //     default: null
        // }
        
    },
    {
        timestamps: true
    }
)
//Listing: Review - 1: many

module.exports = model("Listing", listingSchema);