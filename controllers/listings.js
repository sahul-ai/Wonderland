const Listing = require("../models/listing");

module.exports.index =  async(req,res)=> {
    let allListings =   await Listing.find({});
       res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");  }

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate("owner");
    if(!list){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    else{
         res.render("listings/show.ejs",{list});
    }
   
}

module.exports.createListing = async(req,res)=> {
    let url = req.file.path;
    let filename = req.file.filename;

//   let  {title, description,price,image,country,location} = req.body.listing;
//     let list = new Listing({
//         title:title,
//         description:description,
//         price:price,
//         country:country,
//         location:location
//     });
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");

};

module.exports.renderEditForm =  async(req,res)=>{
    let {id} = req.params;  
    const list = await Listing.findById(id);
     if(!list){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }else{
        let originalImageUrl = list.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_250" )
        res.render("listings/edit.ejs",{list,originalImageUrl});
    }
    
}

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
}