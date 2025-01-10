const statService = require("../../services/v1/checkCine/stat");

const stat = async (req, res) => {
    try {
        const results = await statService.getStatus();
        res.json(results);
    } catch (err) {
        global.errorLogger(err, req);
    }
};

module.exports = { stat };
