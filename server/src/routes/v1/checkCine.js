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
    console.log(req.body); // 요청 본문 출력
    res.json({ message: "Date endpoint hit", received: req.body });
});

router.post("/cinema", (req, res) => {
    console.log(req.body);
    res.json({ message: "Cinema endpoint hit", received: req.body });
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
