const { checkValidForm } = require("./checkValidForm");
const { checkDuplication } = require("./checkDuplication");
const { checkAvailableScreen } = require("./checkAvailableScreen");

/**
 * 1. 형식 확인
 * 2. 중복 확인
 * 3. 존재하는 회차인지 확인
 * 4. DB 삽입
 * 5. 결과 전송
 */

const register = async (params) => {
    try {
        const { uuid, multiplex, date, cinema, movie, time } = params;
        if (!uuid || !multiplex || !date || !cinema || !movie || !time) {
            throw new Error("Missing required parameters");
        }

        checkValidForm(params);
        await checkDuplication(params);
        await checkAvailableScreen(params);
    } catch (err) {
        global.errorLogger(err);
    }
};

module.exports = { register };
