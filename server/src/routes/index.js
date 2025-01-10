const express = require("express");
const index = require("../controllers/index");

const router = express.Router();

router.get("/", index.index);

module.exports = router;
