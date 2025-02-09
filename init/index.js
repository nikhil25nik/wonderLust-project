const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";
main()
.then((res) =>{
    console.log("connect to DB");
}).catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url); 
}

const initDB = async () =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"679bb2076a18e8166119518f"}));
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();