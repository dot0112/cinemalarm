const axios = require("axios");
const FormData = require("form-data");

const cinemaLModel = require("../../../models/cinema/cinemaL");
const CreateCheckCineResponseDto = require("../../../dtos/checkCineResponse.dto");

/**
 * 반환 형식
 *
 * + CGV
 * -----
 * + LOTTE CINEMA
 * `DivisionCode|DetailDivisionCode|CinemaID`
 * -----
 * + MEGABOX
 * `brchNo`
 * -----
 */

const cinemaC = async (date) => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
        throw err;
    }
    return result;
};

const cinemaL = async (date) => {
    const result = [];
    const formData = new FormData();
    formData.append(
        "paramList",
        JSON.stringify(
            global.bodyGenerator("L", {
                MethodName: "GetInvisibleMoviePlayInfo",
                playDt: date,
            })
        )
    );
    try {
        const response = await axios.post(
            `${process.env.LOTTECINEMA_URL}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );
        if (response.status === 200) {
            const data = response.data;
            const cinemaRaw = data.Cinemas.Items;

            const disabledCinema = new Set(
                cinemaRaw.map(
                    (e) =>
                        `${e.DivisionCode}|${e.DetailDivisionCode}|${e.CinemaID}`
                )
            );

            const allCinemaData = await cinemaLModel.find({});
            result.push(
                ...allCinemaData.reduce((acc, e) => {
                    const key = `${e.DivisionCode}|${e.DetailDivisionCode}|${e.CinemaID}`;
                    if (!disabledCinema.has(key)) {
                        acc.push(key);
                    }
                    return acc;
                }, [])
            );
        } else {
            throw new Error("Failed to retrieve cinema data");
        }
    } catch (err) {
        global.errorLogger(err);
        throw err;
    }
    return result;
};

const cinemaM = async (date) => {
    const result = [];
    const data = global.bodyGenerator("M", { playDe: date.replace(/-/g, "") });
    try {
        const response = await axios.post(`${process.env.MEGABOX_URL}`, data);
        if (response.status === 200) {
            const data = response.data;
            const cinemaRaw = [...data.areaBrchList, ...data.spclbBrchList];
            result.push(
                ...cinemaRaw.reduce((acc, e) => {
                    if (e.brchFormAt === "Y") {
                        acc.push(`${e.areaCd}/${e.brchNo}`);
                    }
                    return acc;
                }, [])
            );
        } else {
            throw new Error("Failed to retrieve cinema data");
        }
    } catch (err) {
        global.errorLogger(err);
        throw err;
    }
    return result;
};

const cinemaFunctions = {
    C: cinemaC,
    L: cinemaL,
    M: cinemaM,
};

const getCinemas = async ({ mode, date }) => {
    let result = {
        cinema: [],
    };
    try {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            throw new Error(
                `Invalid date format. Expected format: YYYY-MM-DD, Received data: ${date}`
            );
        }

        if (mode && cinemaFunctions[mode]) {
            const response = await cinemaFunctions[mode](date);
            result.cinema = response;
        } else {
            throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (err) {
        global.errorLogger(err);
        throw new CreateCheckCineResponseDto({
            status: 400,
            message: err.message,
        });
    }
    return CreateCheckCineResponseDto.fromRequest({
        mode: mode,
        date: date,
        result: result,
    });
};

module.exports = { getCinemas, cinemaC, cinemaL, cinemaM };
