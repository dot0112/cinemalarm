const {
    updateCinemaC,
    updateCinemaL,
    updateCinemaM,
} = require("./updateCinema");
const { updateMovieC, updateMovieL, updateMovieM } = require("./updateMovie");

const updateCinema = [updateCinemaC, updateCinemaL, updateCinemaM];
const updateMovie = [updateMovieC, updateMovieL, updateMovieM];

const updateDb = async () => {
    const allPromises = [
        ...updateCinema.map((f) => f()),
        ...updateMovie.map((f) => f()),
    ];

    const results = await Promise.allSettled(allPromises);

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(`작업 ${index} 실패:`, result.reason);
        }
    });
};

module.exports = { updateDb };
