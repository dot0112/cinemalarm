const { checkValidForm } = require("./checkValidForm");
const { checkDuplication } = require("./checkDuplication");
const hashingData = require("./hashingData");
const cinemalarmModel = require("../../../models/cinemalarm");

const unregister = async (params) => {
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

        if (isFormValid.status != "success") {
            result.status = 400;
            result.message = "Invalid form data";
            result.error = isFormValid.error;
            return result;
        }

        if (isDuplicate) {
            result.status = 409; // Conflict
            result.message = "Data doesn't exists";
            return result;
        }

        const hash = hashingData.hashWithMD5(params);
        const deletingData = {
            hash: hash,
            uuid: uuid,
            multiplex: multiplex,
            date: date,
            cinema: cinema,
            movie: movie,
            time: time,
        };
        await cinemalarmModel.deleteOne(deletingData);

        result.status = 200;
        result.message = "Alarm unregistered successfully";
        result.data = deletingData;
    } catch (err) {
        global.errorLogger(err);
        result.message = err.message || "An error occurred";
    }
    return result;
};

module.exports = { unregister };
