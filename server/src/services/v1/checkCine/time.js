const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 형식
 *
 * + CGV
 * -----
 * + LOTTE CINEMA
 * `StartTime/EndTime/seqIndex`
 * -----
 * + MEGABOX
 * `playStartTime/playEndTime/playSchdlNo`
 * -----
 */

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
    const cinemaRegex = /^[^\s]+\|[^\s]+\|[^\s]+$/;
    if (!cinemaRegex.test(cinema)) {
        throw new Error(
            `Invalid cinema format. Expected format: {DivisionCode}|{DetailDivisionCode}|{CinemaID}, Received data: ${cinema}`
        );
    }
    const formData = new FormData();
    formData.append(
        "paramList",
        JSON.stringify(
            global.bodyGenerator("L", {
                MethodName: "GetPlaySequence",
                playDate: `${date}`,
                cinemaID: `${cinema}`,
                representationMovieCode: `${movie}`,
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
            const timeRaw = response.data?.PlaySeqs?.Items || [];
            if (Array.isArray(timeRaw)) {
                result.push(
                    ...timeRaw.map(
                        (time, index) =>
                            `${time.StartTime}/${time.EndTime}/${index + 1}`
                    )
                );
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

const timeM = async (date, cinema, movie) => {
    const result = [];
    const cinemaRegex = /^[^\s]+\/[^\s]+$/;
    if (!cinemaRegex.test(cinema)) {
        throw new Error(
            `Invalid cinema format. Expected format: {areaCd}/{brchNo}, Received data: ${cinema}`
        );
    }
    const [areaCd, brchNo] = cinema.split("/");
    const data = global.bodyGenerator("M", {
        playDe: date.replace(/-/g, ""),
        areaCd: `${areaCd}`,
        brchNo1: `${brchNo}`,
        incomeMovieNo: `${movie}`,
    });
    try {
        const response = await axios.post(process.env.MEGABOX_URL, data);
        if (response.status === 200) {
            const timeRaw = response.data?.movieFormList || [];
            if (Array.isArray(timeRaw)) {
                result.push(
                    ...timeRaw.map(
                        (time) =>
                            `${time.playStartTime}/${time.playEndTime}/${time.playSchdlNo}`
                    )
                );
            }
        }
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
