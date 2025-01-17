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
    checkCineController.movie(req, res);
});

router.post("/time", (req, res) => {
    checkCineController.time(req, res);
});

module.exports = router;
