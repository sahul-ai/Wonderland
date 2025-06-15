const express = require("express");
const router = express.Router();  // router object
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}  = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage}); 
  
//implement router.route

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(listingController.createListing));

// new route - for new listing
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,  wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit",  isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;