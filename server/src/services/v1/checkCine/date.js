const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 날짜 형식 (: LOTTE CINEMA 형식)
 * {
 *  date: [
 *      `${year}-${month}-${date}`
 *  ]
 * }
 * 날짜에 패딩 추가 ( "1970/1/1" > "1970-01-01" )
 */

/**
 * CGV 선택 가능 날짜 확인
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const dateC = async () => {
    const result = [];
    try {
        const response = [];
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

/**
 * LOTTE CINEMA 선택 가능 날짜 확인
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const dateL = async () => {
    const result = [];
    const formData = new FormData();
    formData.append(
        "paramList",
        JSON.stringify(
            global.bodyGenerator("L", {
                MethodName: "GetTicketingPageTOBE",
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
            const dateRaw = data.MoviePlayDates.Items.Items;
            result.push(
                ...dateRaw
                    .filter((e) => e.IsPlayDate === "Y")
                    .map((e) => e.PlayDate)
            );
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

/**
 * MEGABOX 선택 가능 날짜 확인
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const dateM = async () => {
    const result = [];
    const data = global.bodyGenerator("M");
    try {
        const response = await axios.post(`${process.env.MEGABOX_URL}`, data);
        if (response.status === 200) {
            const data = response.data;
            const dateRaw = data.movieFormDeList;
            result.push(
                ...dateRaw.map((e) =>
                    e.playDe.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
                )
            );
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

// `dateFunctions` 오브젝트에 (Multiplex 기호: 함수) 형식으로 삽입
const dateFunctions = {
    C: dateC,
    L: dateL,
    M: dateM,
};

/**
 * 특정 Multiplex 선택 가능 날짜 확인
 * @param {String} mode Multiplex 특정 기호
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const getDates = async (mode) => {
    let result = {
        date: [],
    };
    try {
        if (mode && dateFunctions[mode]) {
            const response = await dateFunctions[mode]();
            result.date = response;
        } else {
            throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

module.exports = { getDates, dateC, dateL, dateM };
