const router = require("express").Router();

router.use("/ws", require("./webchat"));
router.use("/api/auth", require("./auth"));

module.exports = router;
