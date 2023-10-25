//like or dislike (heart / save)

//reference Tenant 
//do not reference Listing: we wouldn't show likes/dislikes by listing; we would show reviews by listing

const { Schema, model } = require('mongoose')

const ratingSchema = new Schema(
    {
        heart: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },
        owner: {type: Schema.Types.ObjectId, ref: 'Tenant'}
        
    },
    {
        timestamps: true
    }
)

module.exports = model("Rating", ratingSchema);
