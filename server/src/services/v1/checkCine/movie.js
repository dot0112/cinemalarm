const axios = require("axios");
const FormData = require("form-data");

const movieC = async (date, cinema) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const movieL = async (date, cinema) => {
    const result = new Set();
    const formData = new FormData();
    formData.append(
        "paramList",
        JSON.stringify(
            global.bodyGenerator("L", {
                MethodName: "GetPlaySequence",
                playDate: date,
                cinemaID: cinema,
            })
        )
    );
    try {
        const response = await axios.post(
            process.env.LOTTECINEMA_URL,
            formData,
            { headers: formData.getHeaders() }
        );
        if (response.status === 200) {
            const movieRaw = response.data?.PlaySeqsHeader?.Items || [];
            if (Array.isArray(movieRaw)) {
                movieRaw.forEach((movie) =>
                    result.add(movie.RepresentationMovieCode)
                );
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return Array.from(result);
};

const movieM = async (date, cinema) => {
    const result = [];
    const data = global.bodyGenerator("M", {
        playDe: date.replace(/-/g, ""),
        incomeBrchNo1: `${cinema}`,
    });
    try {
        const response = await axios.post(`${process.env.MEGABOX_URL}`, data);
        if (response.status === 200) {
            const data = response.data;
            const movieRaw = data.movieList;
            if (Array.isArray(movieRaw)) {
                result.push(...movieRaw.map((e) => `${e.movieNo}`));
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const movieFunctions = {
    C: movieC,
    L: movieL,
    M: movieM,
};

const getMovies = async (mode, date, cinema) => {
    let result = {
        movie: [],
    };
    try {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            throw new Error(
                `Invalid date format. Expected format: YYYY-MM-DD, Received data: ${date}`
            );
        }

        if (!cinema || typeof cinema !== "string") {
            throw new Error(`Invalid cinema ID: ${cinema}`);
        }

        if (mode && movieFunctions[mode]) {
            const response = await movieFunctions[mode](date, cinema);
            result.movie = response;
        } else {
            throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

module.exports = { getMovies, movieC, movieL, movieM };
