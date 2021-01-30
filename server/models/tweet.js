const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
