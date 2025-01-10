const axios = require("axios");
const FormData = require("form-data");

/**
 * 반환 날짜 형식
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
        result = response;
    } catch (err) {
        global.errorLogger(err, req);
    }
    return result;
};

/**
 * LOTTE CINEMA 선택 가능 날짜 확인
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const dateL = async () => {
    const result = [];
    try {
        const response = [];
        result = response;
    } catch (err) {
        global.errorLogger(err, req);
    }
    return result;
};

/**
 * MEGABOX 선택 가능 날짜 확인
 * @returns {Array} - 선택 가능 날짜 리스트
 */
const dateM = async () => {
    const result = [];
    try {
        const response = [];
        result = response;
    } catch (err) {
        global.errorLogger(err, req);
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
    let results = {
        date: [],
    };
    try {
        if (mode) {
            const response = await dateFunctions[mode]();
            results.date = response;
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return results;
};

module.exports = { getDates, dateC, dateL, dateM };
