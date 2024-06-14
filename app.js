const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = ("mongodb://127.0.0.1:27017/wanderlust");

main()
.then(()=>{
    console.log("server connectrd to DB")
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// Index Route
app.get("/listings",async(req,res)=>{
     let allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings})
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show route
app.get("/listings/:id",async(req,res)=>{
    let{id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});

// Create route
app.post("/listings",async (req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route

app.get("/listings/:id/edit", async(req,res)=>{
    let{id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
  });

// Delete Route

app.delete("/listings/:id",async(req,res)=>{
    let{id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   res.redirect("/listings")
   console.log(deletedListing);
});
// app.get("/testListing",(req,res)=>{
//    let sampleListing = new Listing({
//     title:"My new villa",
//     description:"by near beach",
//     price:1200,
//     location:"Calungute , Goa",
//     country:"India"
//    });

//    sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing !");
// })

app.get("/",(req,res)=>{
    res.send("Hi , I am root !");
})
app.listen(8080,()=>{
    console.log("server is working on port 8080 !");
})