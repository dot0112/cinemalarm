const cinemalarmModel = require("../../../models/cinemalarm");
const hashingData = require("./hashingData");

const checkDuplication = async (object) => {
    try {
        const hash = hashingData.hashWithMD5(object);

        const searchResult = await cinemalarmModel.find({ hash: hash });
        if (searchResult.length > 0) {
            return false;
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return true;
};

module.exports = { checkDuplication };
