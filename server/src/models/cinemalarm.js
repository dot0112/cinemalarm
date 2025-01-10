const mongoose = require("mongoose");

const cinemalarmSchema = new mongoose.Schema(
    {},
    {
        timestamps: true,
        collection: "cinemalarm",
    }
);

module.exports = mongoose.model("cinemalarm", cinemalarmSchema);
