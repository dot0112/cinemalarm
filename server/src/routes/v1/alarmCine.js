const express = require("express");

const router = express.Router();

/**
 * https://{Server Address}/alarmCine/
 */

router.post("/register", (req, res) => {
    console.log(req.body);
    res.json({ message: "Register endpoint hit", received: req.body });
});

router.post("/unregister", (req, res) => {
    console.log(req.body);
    res.json({ message: "Unregister endpoint hit", received: req.body });
});

module.exports = router;
