const mongoose = require("mongoose");

const movieCSchema = new mongoose.Schema(
    {
        // 자료 수집중
    },
    {
        timestamps: true,
        collection: "movie_C",
    }
);

module.exports = mongoose.model("movie_C", movieCSchema);
