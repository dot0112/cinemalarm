const mongoose = require("mongoose");

const cinemaMSchema = new mongoose.Schema(
    {
        areaCd: {
            type: String,
            require: true,
        },
        brchNo: {
            type: String,
            require: true,
        },
        areaCdNm: {
            type: String,
        },
        brchNm: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "cinema_M",
    }
);

module.exports = mongoose.model("cinema_M", cinemaMSchema);
