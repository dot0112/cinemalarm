const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 형식
 *
 * + CGV
 * -----
 * + LOTTE CINEMA
 * -----
 * + MEGABOX
 * -----
 */

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
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const movieM = async (date, cinema) => {
    const result = [];
    try {
        const response = [];
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
