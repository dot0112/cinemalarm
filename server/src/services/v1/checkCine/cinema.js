const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 형식
 *
 * + CGV
 * -----
 * + LOTTE CINEMA
 * "DivisionCode|DetailDivisionCode|CinemaID"
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
    const formData = new FormData();
    formData.append(
        "paramList",
        JSON.stringify(global.bodyGenerator("L", { playDate: date }))
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
            // LOTTE CINEMA는 상영하지 않는 극장의 목록을 반환함
            // DB의 추가가 필요
        }
    } catch (err) {
        global.errorLogger(err);
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
                ...cinemaRaw
                    .filter((e) => e.brchFormAt === "Y")
                    .map((e) => `${e.areaCd}/${e.brchNo}`)
            );
        }
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
