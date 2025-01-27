const { checkValidForm } = require("./checkValidForm");
const { checkDuplication } = require("./checkDuplication");
const { checkAvailableScreen } = require("./checkAvailableScreen");
const hashingData = require("./hashingData");
const cinemalarmModel = require("../../../models/cinemalarm");

const register = async (params) => {
    const result = {
        status: 500,
        message: "Internal server error",
        data: {},
        error: {},
    };
    try {
        const { uuid, multiplex, date, cinema, movie, time } = params;

        const requiredParams = [
            "uuid",
            "multiplex",
            "date",
            "cinema",
            "movie",
            "time",
        ];
        const missingParams = requiredParams.filter((param) => !params[param]);
        if (missingParams.length > 0) {
            result.status = 400;
            result.message = "Missing required parameters";
            result.error = Object.fromEntries(
                missingParams.map((param) => [param, true])
            );
            return result;
        }

        const isFormValid = checkValidForm(params);
        const isDuplicate = await checkDuplication(params);
        const isScreenAvailable = await checkAvailableScreen(params);

        if (isFormValid.status != "success") {
            result.status = 400;
            result.message = "Invalid form data";
            result.error = isFormValid.error;
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
        const savingData = {
            hash: hash,
            uuid: uuid,
            multiplex: multiplex,
            date: date,
            cinema: cinema,
            movie: movie,
            time: time,
        };
        const newAlarm = new cinemalarmModel(savingData);
        await newAlarm.save();

        result.status = 200;
        result.message = "Alarm registered successfully";
        result.data = savingData;
    } catch (err) {
        global.errorLogger(err);
        result.message = err.message || "An error occurred";
    }
    return result;
};

module.exports = { register };
