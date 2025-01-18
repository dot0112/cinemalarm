const { checkValidForm } = require("./checkValidForm");
const { checkDuplication } = require("./checkDuplication");
const { checkAvailableScreen } = require("./checkAvailableScreen");
const hashingData = require("./hashingData");
const cinemalarmModel = require("../../../models/cinemalarm");

const register = async (params) => {
    const result = {
        status: 500,
        message: "Internal server error",
    };
    try {
        const { uuid, multiplex, date, cinema, movie, time } = params;
        if (!uuid || !multiplex || !date || !cinema || !movie || !time) {
            result.status = 400;
            result.message = "Missing required parameters";
            return result;
        }

        const isFormValid = checkValidForm(params);
        const isDuplicate = await checkDuplication(params);
        const isScreenAvailable = await checkAvailableScreen(params);

        if (!isFormValid) {
            result.status = 400;
            result.message = "Invalid form data";
            return result;
        }

        if (!isDuplicate) {
            result.status = 409; // Conflict
            result.message = "Duplicate data exists";
            return result;
        }

        if (!isScreenAvailable) {
            result.status = 400;
            result.message = "Screen not available";
            return result;
        }

        const hash = hashingData.hashWithMD5(params);
        const newAlarm = new cinemalarmModel({
            hash: hash,
            uuid: uuid,
            multiplex: multiplex,
            date: date,
            cinema: cinema,
            movie: movie,
            time: time,
        });
        await newAlarm.save();

        result.status = 200;
        result.message = "Alarm registered successfully";
    } catch (err) {
        global.errorLogger(err);
        result.message = err.message || "An error occurred";
    }
    return result;
};

module.exports = { register };
