const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: String,
    image:{
        url: String,
        filename: String
       },
    price: Number,
    location: String, 
    country: String,

    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    },
    ],
    owner:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     }  
});


//middleware used in when delete listing review will also delete related to listing
listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({_id: {$in :listing.reviews}});
    }
});


const Listing = new mongoose.model("Listing", listingSchema);
module.exports= Listing;