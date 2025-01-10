const express = require("express");

const router = express.Router();

/**
 * https://{Server Address}/meta/
 */

router.get("/lastUpdate", (req, res) => {
    res.send("LastUpdate endpoint hit");
});

router.post("/data", () => (req, res) => {
    console.log(req.body);
    res.json({ message: "Data endpoint hit", received: req.body });
});

router.post("/changes", (req, res) => {
    console.log(req.body);
    res.json({ message: "Changes endpoint hit", received: req.body });
});

module.exports = router;
