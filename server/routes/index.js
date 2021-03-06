const router = require("express").Router();

router.use("/ws", require("./webchat"));
router.use("/api/auth", require("./auth"));
router.use("/api/tweet", require("./tweet"));

module.exports = router;
