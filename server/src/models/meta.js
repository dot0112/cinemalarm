const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
    {
        multiplex: {
            type: String,
            require: true,
        },
        dataHash: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "meta",
    }
);

module.exports = mongoose.model("meta", metaSchema);
