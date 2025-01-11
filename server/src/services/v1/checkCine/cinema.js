const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 형식
 *
 * + CGV
 * -----
 * + LOTTE CINEMA
 *
 * -----
 * + MEGABOX
 *
 * -----
 */

const cinemaC = async (date) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const cinemaL = async (date) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const cinemaM = async (date) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const cinemaFunctions = {
    C: cinemaC,
    L: cinemaL,
    M: cinemaM,
};

const getCinemas = async (mode, date) => {
    let result = {
        cinema: [],
    };
    try {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            console.warn(
                "Invalid date format. Expected format: YYYY-MM-DD \t Recived data: date"
            );
        }

        if (mode && cinemaFunctions[mode]) {
            const response = await cinemaFunctions[mode](date);
            result.cinema = response;
        } else {
            console.warn(`Invalid mode: ${mode}`);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

module.exports = { getCinemas, cinemaC, cinemaL, cinemaM };
