const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//Index Route
router.get("/", wrapAsync(listingController.indexListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewListing);

//Post Route
router.post("/", validateListing, wrapAsync(listingController.postListing));

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Update Route
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
