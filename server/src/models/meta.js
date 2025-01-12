const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
    {
        multiplex: {
            type: String,
            require: true,
        },
        dataHashCinema: {
            type: String,
        },
        dataHashMovie: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "meta",
    }
);

module.exports = mongoose.model("meta", metaSchema);
