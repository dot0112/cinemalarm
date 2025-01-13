const express = require("express");
const checkCineController = require("../../controllers/v1/checkCine");

const router = express.Router();

/**
 * https://{Server Address}/checkCine/
 */

// GET 요청 처리
router.get("/stat", (req, res) => {
    checkCineController.stat(req, res);
});

// POST 요청 처리
router.post("/date", (req, res) => {
    checkCineController.date(req, res);
});

router.post("/cinema", (req, res) => {
    checkCineController.cinema(req, res);
});

router.post("/movie", (req, res) => {
    console.log(req.body);
    res.json({ message: "Movie endpoint hit", received: req.body });
});

router.post("/time", (req, res) => {
    console.log(req.body);
    res.json({ message: "Time endpoint hit", received: req.body });
});

module.exports = router;
