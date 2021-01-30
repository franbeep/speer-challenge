const router = require("express").Router();
const auth = require("../controllers/auth");

router.post(
  "/register",
  [
    auth.checkFieldsByRoute("register"),
    auth.checkUserExistsByFields("username", "email"),
  ],
  auth.registerUser
);

router.post(
  "/login",
  [
    auth.checkFieldsByRoute("login"),
    auth.checkUserExistsByFields("username"),
    auth.checkCredentials,
  ],
  auth.sendToken
);

router.get("/restricted", [auth.checkToken], (req, res) => {
  res.status(200).json({
    message: "You are currently accessing a restricted area with your token.",
  });
});

module.exports = router;
