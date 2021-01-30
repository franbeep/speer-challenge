const router = require("express").Router();
const auth = require("../controllers/auth");
const chat = require("../controllers/webchat");

// router.ws("/", [auth.checkToken], chat.handleConnections);
router.ws("/", chat.handleConnections);

module.exports = router;
