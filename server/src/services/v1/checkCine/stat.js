const axios = require("axios");
const FormData = require("form-data");

/**
 * CGV API 동작 확인
 * @returns {Object} - { C: boolean } API 동작 여부 (CGV)
 */
const statC = async () => {
    const result = { C: false };
    try {
        const response = false;
        result.C = response;
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

/**
 * LOTTE CINEMA API 동작 확인
 * @returns {Object} - { L: boolean } API 동작 여부 (LOTTE CINEMA)
 */
const statL = async () => {
    const result = { L: false };
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
        result.L = response.status === 200;
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

/**
 * MEGABOX API 동작 확인
 * @returns {Object} - { M: boolean } API 동작 여부 (MEGABOX)
 */
const statM = async () => {
    const result = { M: false };
    const data = global.bodyGenerator("M");
    try {
        const response = await axios.post(`${process.env.MEGABOX_URL}`, data);
        result.M = response.status === 200;
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

// `statFunctions` 배열에 함수들을 할당
const statFunctions = [statC, statL, statM];

/**
 * 전체 API 동작 확인
 * @returns {Object} - { C: boolean, L: boolean, M: boolean } 각 API의 동작 여부
 */
const getStatus = async () => {
    let result = { C: false, L: false, M: false };
    try {
        const promises = statFunctions.map((f) => f());
        const responses = await Promise.allSettled(promises);

        responses.forEach((response, index) => {
            if (response.status === "fulfilled") {
                result = { ...result, ...response.value };
            } else {
                console.warn(`API ${index} failed:`, response.reason);
            }
        });
    } catch (err) {
        global.errorLogger(err);
    }
    return result;
};

module.exports = { getStatus, statC, statL, statM };
