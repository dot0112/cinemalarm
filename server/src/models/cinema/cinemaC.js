const mongoose = require("mongoose");

const cinemaCSchema = new mongoose.Schema(
    {
        // 자료 수집중
    },
    {
        timestamps: true,
        collection: "cinema_C",
    }
);

module.exports = mongoose.model("cinema_C", cinemaCSchema);
