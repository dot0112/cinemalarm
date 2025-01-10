const mongoose = require("mongoose");

const movieMSchema = new mongoose.Schema(
    {
        movieNo: {
            type: String,
            require: true,
        },
        movieNm: {
            type: String,
        },
        admisClassCdNm: {
            type: String,
        },
        playTime: {
            type: String,
        },
        movieImgPath: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "movie_M",
    }
);

module.exports = mongoose.model("movie_M", movieMSchema);
