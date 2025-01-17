const mongoose = require("mongoose");

const cinemalarmSchema = new mongoose.Schema(
    {
        hash: {
            type: String,
            require: true,
        },
        uuid: {
            type: String,
            require: true,
        },
        multiplex: {
            type: String,
            require: true,
        },
        date: {
            type: String,
            require: true,
        },
        cinema: {
            type: String,
            require: true,
        },
        movie: {
            type: String,
            require: true,
        },
        time: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
        collection: "cinemalarm",
    }
);

module.exports = mongoose.model("cinemalarm", cinemalarmSchema);
