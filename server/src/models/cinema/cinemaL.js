const mongoose = require("mongoose");

const cinemaLSchema = new mongoose.Schema(
    {
        DivisionCode: {
            type: Number,
            require: true,
        },
        DetailDivisionCode: {
            type: String,
            require: true,
        },
        CinemaID: {
            type: Number,
            require: true,
        },
        GroupNameKR: {
            type: String,
        },
        CinemaNameKR: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "cinema_L",
    }
);

module.exports = mongoose.model("cinema_L", cinemaLSchema);
