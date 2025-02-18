const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const { validateReview, isAuthor, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Post
//Review route
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.postReview)
);

router.delete("/:rid", isLoggedIn, isAuthor, reviewController.destroyReview);

module.exports = router;
