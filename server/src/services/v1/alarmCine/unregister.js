const { checkValidForm } = require("./checkValidForm");
const { checkDuplication } = require("./checkDuplication");
const hashingData = require("./hashingData");
const cinemalarmModel = require("../../../models/cinemalarm");

const unregister = async (params) => {
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

        if (!isFormValid) {
            result.status = 400;
            result.message = "Invalid form data";
            return result;
        }

        if (isDuplicate) {
            result.status = 409; // Conflict
            result.message = "Data doesn't exists";
            return result;
        }

        const hash = hashingData.hashWithMD5(params);
        await cinemalarmModel.deleteOne({ hash: hash });

        result.status = 200;
        result.message = "Alarm unregistered successfully";
    } catch (err) {
        global.errorLogger(err);
        result.message = err.message || "An error occurred";
    }
    return result;
};

module.exports = { unregister };
