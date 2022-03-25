const express = require("express");
const router = express.Router();

// domovská stránka
router.get("/", function (req, res, next) {
    res.sendFile("index");
});


module.exports = router;
