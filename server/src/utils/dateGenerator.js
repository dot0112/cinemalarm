const dateGenerator = (mode, year = "", month = "", day = "") => {
    let result = null;
    const now = new Date();
    year = year || now.getFullYear();
    month = String(month || now.getMonth() + 1).padStart(2, "0");
    day = String(day || now.getDate()).padStart(2, "0");
    switch (mode) {
        case "C":
            break;
        case "L":
            result = `${year}-${month}-${day}`;
            break;
        case "M":
            result = `${year}${month}${day}`;
            break;
        default:
            break;
    }
    return result;
};

global.dateGenerator = dateGenerator;
module.exports = { dateGenerator };
