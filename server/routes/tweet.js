const router = require("express").Router();
const auth = require("../controllers/auth");
const tweet = require("../controllers/tweet");

router.post(
  "/",
  [auth.checkToken, tweet.checkFieldsByAction("create")],
  tweet.createTweet
);

router.get("/", [auth.checkToken], tweet.findOneTweet);

router.get("/user/", [auth.checkToken], tweet.findTweet);

router.put(
  "/",
  [
    auth.checkToken,
    tweet.checkFieldsByAction("update"),
    tweet.checkOwnershipTweet,
  ],
  tweet.updateTweet
);

router.delete(
  "/",
  [
    auth.checkToken,
    tweet.checkFieldsByAction("delete"),
    tweet.checkOwnershipTweet,
  ],
  tweet.deleteTweet
);

module.exports = router;
