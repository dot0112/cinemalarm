const axios = require("axios");
const FormData = require("form-data");

const checkScreenC = async ({ date, cinema, movie, time }) => {
    const result = true;
    return result;
};

const checkScreenL = async ({ date, cinema, movie, time }) => {
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
            const screenRaw = response.data?.PlaySeqs?.Items || [];
            const PlaySequence = time.split("/")[2];
            if (Array.isArray(screenRaw) && PlaySequence) {
                for (const screen of screenRaw) {
                    if (`${screen.PlaySequence}` === PlaySequence) {
                        return true;
                    }
                }
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return false;
};

const checkScreenM = async ({ date, cinema, movie, time }) => {
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
        movieNo1: `${movie}`,
    });
    try {
        const result = await axios.post(process.env.MEGABOX_URL, data);
        if (result.status === 200) {
            const screenRaw = response.data?.movieFormList || [];
            const playSchdlNo = time.split("/")[2];
            if (Array.isArray(screenRaw) && playSchdlNo) {
                for (const screen of screenRaw) {
                    if (`${screen.playSchdlNo}` === playSchdlNo) {
                        return true;
                    }
                }
            }
        }
        return true;
    } catch (err) {
        global.errorLogger(err);
    }
    return false;
};

const checkScreenFunctions = {
    C: checkScreenC,
    L: checkScreenL,
    M: checkScreenM,
};

const checkAvailableScreen = async (object) => {
    const { multiplex, date, cinema, movie, time } = object;
    if (!multiplex || !date || !cinema || !movie || !time) {
        throw new Error("Missing required parameters");
    }

    if (!(multiplex in checkScreenFunctions)) {
        throw new Error(`Invalid multiplex: ${multiplex}`);
    }

    try {
        const checkScreenResult = await checkScreenFunctions[multiplex]({
            date: date,
            cinema: cinema,
            movie: movie,
            time: time,
        });
        if (!checkScreenResult) {
            throw new Error(`Invalid screen`);
        }
        return true;
    } catch (err) {
        global.errorLogger(err);
    }
    return false;
};

module.exports = {
    checkAvailableScreen,
    checkScreenC,
    checkScreenL,
    checkScreenM,
};
