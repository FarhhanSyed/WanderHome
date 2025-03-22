const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings");

const dbUrl = process.env.DB_URL;
// console.log(dbUrl);
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67de85ba16f6a0ef69bc63db",
  }));
  await Listing.insertMany(initData.data);
  console.log("Initialized Database");
};
initDB();
