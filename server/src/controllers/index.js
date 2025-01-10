const indexService = require("../services/index");

const index = (req, res) => {
    res.send(indexService.drawPineapple());
};

module.exports = { index };
