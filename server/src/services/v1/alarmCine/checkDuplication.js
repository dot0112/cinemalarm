const cinemalarmModel = require("../../../models/cinemalarm");
const hashingData = require("./hashingData");

const checkDuplication = async (object) => {
    try {
        const hash = hashingData.hashWithMD5(object);

        const searchResult = await cinemalarmModel.findOne({ hash: hash });

        if (!searchResult || searchResult.length > 0) {
            return false;
        }
        return true;
    } catch (err) {
        global.errorLogger(err);
    }
    return false;
};

module.exports = { checkDuplication };
