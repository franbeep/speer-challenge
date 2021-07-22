const { body, validationResult } = require("express-validator");
const Tweet = require("../models/tweet");

const checkOwnershipTweet = (req, res, next) => {
  Tweet.findOne({ _id: req.body.id, user: req.user._id })
    .lean()
    .then((tweet) => {
      if (tweet) {
        next();
      } else {
        res
          .status(401)
          .send({ message: "You are not authorized to perform this action." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

/**
 * Check and Sanitize fields of API endpoints based on action
 * @param {string} method - [create, update, delete]
 */
const checkFieldsByAction = (method) => {
  let chain = [];

  switch (method) {
    case "create":
      // message
      chain = [
        body("message")
          .isLength({ min: 20, max: 280 })
          .not()
          .isEmpty()
          .trim()
          .escape(),
      ];
      break;
    case "update":
      // message + id
      chain = [
        body("message")
          .isLength({ min: 20, max: 280 })
          .not()
          .isEmpty()
          .trim()
          .escape(),
        body("id").not().isEmpty().trim().escape(),
      ];
      break;
    case "delete":
      // id
      chain = [body("id").not().isEmpty().trim().escape()];
      break;
    default:
      return [
        (req, res, next) => {
          console.error(
            `Error: Wrong route '${route}' passed to checkFieldsByRoute.`
          );
          return res.status(500).json({ errors: "Internal Server Error" });
        },
      ];
  }

  return [
    ...chain,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

/**
 * Create Tweet
 */
const createTweet = (req, res, next) => {
  Tweet.create({
    message: req.body.message,
    user: req.user._id,
  })
    .then((tweet) => {
      res.status(201).send({
        message: "Sent a tweet.",
        tweet,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

/**
 * Update (your)  Tweet
 */
const updateTweet = (req, res, next) => {
  Tweet.findOneAndUpdate({ _id: req.body.id }, { message: req.body.message })
    .then((tweet) => {
      res.status(201).send({
        message: "Tweet updated.",
        tweet,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

/**
 * Find one Tweet
 */
const findOneTweet = (req, res, next) => {
  // still need to sanitize query params perhaps

  if (!req.query.id) {
    return res.status(400).send({ message: "Id not found" });
  }

  Tweet.findOne({ _id: req.query.id })
    .lean()
    .then((tweet) => {
      res.status(200).send({
        tweet,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

/**
 * Find one or more Tweets
 */
const findTweet = (req, res, next) => {
  // still need to sanitize query params perhaps

  if (!req.query.username) {
    return res.status(400).send({ message: "Username not found" });
  }

  Tweet.find({ username: req.query.username })
    .sort({ date: -1 })
    .limit(50)
    .lean()
    .then((tweets) => {
      res.status(200).send({
        tweets,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

/**
 * Delete (your) Tweet
 */
const deleteTweet = (req, res, next) => {
  Tweet.deleteOne({ _id: req.body.id })
    .then(() => {
      res.status(200).send({
        message: "Deleted a tweet.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

module.exports = {
  checkOwnershipTweet,
  checkFieldsByAction,
  createTweet,
  updateTweet,
  findOneTweet,
  findTweet,
  deleteTweet,
};
