const crypto = require("crypto");

const hashWithMD5 = (data) => {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
};

module.exports = { hashWithMD5 };
