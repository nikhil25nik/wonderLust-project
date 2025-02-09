const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type:String
    },
    image: {
        url:String,
        filename:String,
      },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"review",
        },
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:[Number],
        require:true,
        index: '2dsphere',
    },

});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
    await review.deleteMany({_id : {$in:listing.review}});
        
    }
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;