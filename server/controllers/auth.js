const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

/**
 * Checks if the user exists based on fields
 * @param {Array string} field - [username, email]
 */
const checkUserExistsByFields = (...fields) => {
  return (req, res, next) => {
    let payload = [];
    if (fields.includes("username")) {
      payload.push({ username: req.body.username });
    }
    if (fields.includes("email")) {
      payload.push({ email: req.body.email });
    }

    User.findOne({ $or: payload })
      .lean()
      .then((user) => {
        req.userExists = user ? true : false;
        next();
      });
  };
};

/**
 * Check and sanitize fields of Register endpoint
 */
const checkRegisterFields = () => {
  return [
    body("username").isLength({ min: 5 }).not().isEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).not().isEmpty().escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ route: "register", errors: errors.array() });
      }
      next();
    },
  ];
};

/**
 * Check and sanitize fields of login endpoint
 */
const checkLoginFields = () => {
  return [
    body("username").isLength({ max: 50 }).not().isEmpty().trim().escape(),
    body("password").isLength({ max: 50 }).not().isEmpty().escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ route: "login", errors: errors.array() });
      }
      next();
    },
  ];
};

/**
 * Register controller: Assumes data is ok and will create the user.
 */
const registerUser = (req, res, next) => {
  if (req.userExists) {
    return res.status(400).send({ message: "Username already in use." });
  }

  User.create({
    username: `${req.body.username}`,
    email: `${req.body.email}`,
    password: bcrypt.hashSync(req.body.password, 8),
  }).then((user) => {
    res.status(201).send({
      message: `User ${user.username} created with success.`,
      user,
    });
  });
};

/**
 * Check credentials of the payload. Assumes sanitized data and procceds checkUserExists middlware.
 */
const checkCredentials = (req, res, next) => {
  if (!req.userExists) {
    return res.status(401).send({ message: "Invalid credentials." });
  }

  User.findOne({
    username: req.body.username,
  })
    .lean()
    .then((user) => {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordIsValid) {
        req.user = user;
        next();
      } else {
        return res.status(401).send({ message: "Invalid credentials." });
      }
    });
};

/**
 * Check wether the JWT is valid
 */
const checkToken = (req, res, next) => {
  let token;
  try {
    token = req.headers["authorization"].split(" ")[1]; // pattern: "Authorization: Bearer {{JWT Token}}"
  } catch (err) {
    return res.status(401).send({ message: "No token provided." });
  }

  jwt.verify(token, process.env.SECRET, (failed, decoded) => {
    if (failed) {
      return res.status(401).send({ message: "Invalid token." });
    }
    req.userId = decoded.id;
    User.find({ _id: decoded.id }).then((users) => {
      const [user] = users;
      req.user = user; // injecting user data into the request to use later
      next();
    });
  });
};

/**
 * Send a JWT based on credentials acquired on the previous pipelined function.
 */
const sendToken = (req, res, next) => {
  var token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
    expiresIn: 86400, // 24 hours
  });
  res.status(201).send({
    username: req.user.username,
    email: req.user.email,
    accessToken: token,
  });
};

module.exports = {
  checkUserExistsByFields,
  checkRegisterFields,
  checkLoginFields,
  checkCredentials,
  registerUser,
  checkToken,
  sendToken,
};
