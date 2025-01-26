const express = require("express");
const alarmCineController = require("../../controllers/v1/alarmCine");

const router = express.Router();

/**
 * https://{Server Address}/alarmCine/
 */

router.post("/register", (req, res) => {
    alarmCineController.register(req, res);
});

router.post("/unregister", (req, res) => {
    alarmCineController.unregister(req, res);
});

module.exports = router;
