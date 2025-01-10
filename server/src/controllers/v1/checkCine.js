const statService = require("../../services/v1/checkCine/stat");
const dateService = require("../../services/v1/checkCine/date");

const stat = async (req, res) => {
    try {
        const result = await statService.getStatus();
        res.json(result);
    } catch (err) {
        global.errorLogger(err, req);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

const date = async (req, res) => {
    try {
        const mode = req.body.multiplex;
        const result = await dateService.getDates(mode);
        res.json(result);
    } catch (err) {
        global.errorLogger(err, req);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

module.exports = { stat, date };
