const express = require("express");
const alarmCineRouter = require("./alarmCine");
const checkCineRouter = require("./checkCine");
const metaRouter = require("./meta");

const router = express.Router();

router.use("/alarmCine", alarmCineRouter);
router.use("/checkCine", checkCineRouter);
router.use("/meta", metaRouter);

module.exports = router;
