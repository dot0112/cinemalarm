const bodyGenerator = (mode, bodyData = {}) => {
    let body = null;
    switch (mode) {
        case "C":
            break;
        case "L":
            body = { ...presetL, ...bodyData };
            break;
        case "M":
            body = { ...presetM, ...bodyData };
            body.playDe = body.playDe || global.dateGenerator(mode);
            break;
        default:
            break;
    }
    return body;
};

const presetL = {
    MethodName: "GetTicketingPageTOBE",
    channelType: "HO",
    osType: "W",
    osVersion:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    memberOnNo: "0",
    playDate: "",
    cinemaID: "",
    representationMovieCode: "",
    cinemaList: "",
    movieCd: "",
};

const presetM = {
    playDe: "",
    incomeMovieNo: "",
    onLoad: "Y",
    sellChnlCd: "",
    incomeTheabKindCd: "",
    incomeBrchNo1: "",
    incomePlayDe: "",
};

global.bodyGenerator = bodyGenerator;
module.exports = { bodyGenerator };
