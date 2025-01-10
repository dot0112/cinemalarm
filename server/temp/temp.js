const dateGenerator = (mode) => {
    let result = null;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
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

(() => {
    console.log(dateGenerator("L"));
    console.log(dateGenerator("M"));
})();
