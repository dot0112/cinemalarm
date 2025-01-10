const mongoose = require("mongoose");

const movieLSchema = new mongoose.Schema(
    {
        RepresentationMovieCode: {
            type: String,
            require: true,
        },
        MovieNameKR: {
            type: String,
        },
        PosterURL: {
            type: String,
        },
        ViewGradeNameKR: {
            type: String,
        },
        PlayTime: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: "movie_L",
    }
);

module.exports = mongoose.model("movie_L", movieLSchema);
