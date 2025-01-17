const axios = require("axios");
const FormData = require("form-data");

const timeC = async (date, cinema, movie) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const timeL = async (date, cinema, movie) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const timeM = async (date, cinema, movie) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const timeFunctions = {
    C: timeC,
    L: timeL,
    M: timeM,
};

const getTimes = async (mode, date, cinema, movie) => {
    const result = {
        time: [],
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

        if (!movie || typeof movie !== "string") {
            throw new Error(`Invalid movie ID: ${movie}`);
        }

        if (mode && timeFunctions[mode]) {
            const response = await timeFunctions[mode](date, cinema, movie);
            result.time = response;
        } else {
            throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

module.exports = { getTimes, timeC, timeL, timeM };
