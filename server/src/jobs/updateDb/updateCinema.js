const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");

const metaModel = require("../../models/meta");
const cinemaCModel = require("../../models/cinema/cinemaC");
const cinemaLModel = require("../../models/cinema/cinemaL");
const cinemaMModel = require("../../models/cinema/cinemaM");

// `cinemaModels` 오브젝트에 (Multiplex 기호: Db 모델) 형식으로 삽입
const cinemaModels = {
    C: cinemaCModel,
    L: cinemaLModel,
    M: cinemaMModel,
};

// `modelKeys` 오브젝트에 (Multiplex 기호: Db key) 형식으로 삽입
const modelKeys = {
    C: [],
    L: ["DivisionCode", "DetailDivisionCode", "CinemaID"],
    M: ["areaCd", "brchNo"],
};

/**
 * MD5 알고리즘으로 해싱
 * @param {Array} data 해싱할 데이터 배열
 * @returns {String} - 해싱 결과
 */
const hashWithMD5 = (data) => {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
};

/**
 * Db에 저장되어 있는 해싱 값과 비교하고 결과를 반환
 * @param {String} mode Multiplex 특정 기호
 * @param {Array} data 가공된 데이터
 * @returns {Boolean} - 일치 여부
 */
const compareSavedHash = async (mode, data) => {
    let result = false;
    const hash = hashWithMD5(data);

    try {
        const metadata = await metaModel.findOne({ multiplex: mode });
        const savedHash = metadata ? metadata.dataHashCinema ?? "" : "";

        result = savedHash === hash;

        if (!result) {
            if (metadata) {
                metadata.dataHashCinema = hash;
                await metadata.save();
            } else {
                await metaModel.create({
                    multiplex: mode,
                    dataHashCinema: hash,
                });
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }

    return result;
};

/**
 * 데이터의 변경 여부에 따라 Db의 Update 연산을 수행
 * @param {String} mode Multiplex 특정 기호
 * @param {Array} data 가공된 데이터
 * @returns {Number} - 추가/변경된 데이터 갯수
 */
const updateData = async (mode, data) => {
    let count = 0;
    try {
        const compareResult = await compareSavedHash(mode, data);

        if (!compareResult) {
            if (data.length > 0) {
                const bulkOps = [];

                for (const item of data) {
                    const keys = {};

                    for (const key of modelKeys[mode]) {
                        keys[key] = item[key];
                    }

                    bulkOps.push({
                        updateOne: {
                            filter: keys,
                            update: { $set: item },
                            upsert: true,
                        },
                    });
                }

                if (bulkOps.length > 0) {
                    const result = await cinemaModels[mode].bulkWrite(bulkOps);
                    count = result.upsertedCount + result.modifiedCount;
                }
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return count;
};

/**
 * CGV의 지점 정보를 Update
 */
const updateCinemaC = async () => {
    let count = 0;
    try {
        const response = [];
        const data = response;

        count = await updateData("C", data);
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Cinema:{CGV} - ${count} objects updated`);
};

/**
 * LOTTE CINEMA의 지점 정보를 Update
 */
const updateCinemaL = async () => {
    let count = 0;
    const formData = new FormData();
    formData.append("paramList", JSON.stringify(global.bodyGenerator("L")));
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
            const data = [];
            const division = {};
            const dataRaw = response.data;
            const cinemaRaws = dataRaw.Cinemas.Cinemas.Items;
            const divisionRaws = [
                ...(dataRaw.CinemaDivison?.AreaDivisions?.Items || []),
                ...(dataRaw.CinemaDivison?.SpecialTypeDivisions?.Items || []),
            ];

            for (const divisionRaw of divisionRaws) {
                data[
                    `${divisionRaw.DivisionCode}/${divisionRaw.DetailDivisionCode}`
                ] = divisionRaw.GroupNameKR;
            }

            for (const cinemaRaw of cinemaRaws) {
                data.push({
                    DivisionCode: cinemaRaw.DivisionCode,
                    DetailDivisionCode: cinemaRaw.DetailDivisionCode,
                    CinemaID: cinemaRaw.CinemaID,
                    CinemaNameKR: cinemaRaw.CinemaNameKR,
                    GroupNameKR:
                        division[
                            `${cinemaRaw.DivisionCode}/${cinemaRaw.DetailDivisionCode}`
                        ],
                });
            }

            count = await updateData("L", data);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Cinema:{LOTTE CINEMA} - ${count} objects updated`);
};

/**
 * MEGABOX의 지점 정보를 Update
 */
const updateCinemaM = async () => {
    let count = 0;
    const bodyData = global.bodyGenerator("M");
    try {
        const response = await axios.post(
            `${process.env.MEGABOX_URL}`,
            bodyData
        );
        if (response.status === 200) {
            const data = [];
            const dataRaw = response.data;
            const cinemaRaws = [
                ...dataRaw.areaBrchList,
                ...dataRaw.spclbBrchList,
            ];

            for (const cinemaRaw of cinemaRaws) {
                data.push({
                    areaCd: cinemaRaw.areaCd,
                    brchNo: cinemaRaw.brchNo,
                    areaCdName: cinemaRaw.areaCdName,
                    brchNm: cinemaRaw.brchNm,
                });
            }

            count = await updateData("M", data);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Cinema:{MEGABOX} - ${count} objects updated`);
};

module.exports = {
    updateCinemaC,
    updateCinemaL,
    updateCinemaM,
    updateData,
    compareSavedHash,
};
