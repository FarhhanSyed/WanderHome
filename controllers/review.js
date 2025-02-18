const Review = require("../models/reviews");
const Listing = require("../models/listings");

module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, rid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
  await Review.findByIdAndDelete(rid);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
