const { model } = require("mongoose");
const listing = require("../models/listing.js");
const opencage = require('opencage-api-client');
const mapToken = process.env.OPENCAGE_API_KEY;
 

module.exports.index = async (req, res) => {
    try {
        let { search, sort } = req.query;
        let query = {}; 

        if (search) {
            query = {
                title: { $regex: search, $options: "i" } // Case-insensitive search
            };
        }

        let sortOption = {};
        if (sort === "title_asc") {
            sortOption = { title: 1 }; // Sort by title A-Z
        } else if (sort === "title_desc") {
            sortOption = { title: -1 }; // Sort by title Z-A
        }

        // Fetch listings with search & sorting applied
        let allListings = await listing.find(query).sort(sortOption);

        // Pass `search` & `sort` to render the view
        res.render("listings/index", { allListings, search, sort });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.renderNewform =  (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.ShowRouteListing = async (req, res) => {
    let { id } = req.params;
    let showListing = await listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    // console.log(showListing);
    if(!showListing){
        req.flash("error","this listing request is not exist");
       return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { showListing });
}

module.exports.listingCreateRoute = async (req, res, next) => {
    let response = await opencage.geocode({
        q: req.body.listing.location,
        limit: 1,
        key: mapToken,
    });

    // Fixed: Check if API response contains valid geometry
    if (response.results && response.results[0] && response.results[0].geometry) {
        let { lat, lng } = response.results[0].geometry;

        // Fixed: Store geometry as [longitude, latitude]
        let geometry = [lng, lat]; 

        console.log("Extracted geometry:", geometry);

        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = geometry; // Store coordinates correctly

        await newListing.save();

        req.flash("success", "Listing created successfully");
        return res.redirect("/listings");
    } else {
        req.flash("error", "Failed to retrieve location coordinates.");
        return res.redirect("/listings/new");
    }
};


module.exports.listingEditRoute = async (req, res) => {
    let { id } = req.params;
    let showListing = await listing.findById(id)
    if(!showListing){
        req.flash("error","this listing request is not exist");
        return  res.redirect("/listings");
    }
    let originalImageUrl = showListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs", { showListing ,originalImageUrl});
}

module.exports.listingUpdateRoute = async (req, res) => {

    

    let { id } = req.params;
    let listings =  await listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(req.body.listing);

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = {url,filename};
    await listings.save();
    }
    
    req.flash("success","listing updated successfully");
    return  res.redirect(`/listings/${id}`);
}

module.exports.listingDestoryRoute =  async(req,res) =>{
    let {id} = req.params;
    deletedData = await listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success","listing deleted successfully");
   return  res.redirect("/listings");
}
