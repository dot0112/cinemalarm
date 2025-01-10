const bodyGenerator = require("../../src/utils/bodyGenerator"); // 실제 경로에 맞게 조정

describe("bodyGenerator 테스트", () => {
    beforeAll(() => {
        global.dateGenerator = jest.fn().mockReturnValue("19700101");
    });

    test("LOTTE CINEMA - 기본 형식", () => {
        const result = bodyGenerator.bodyGenerator("L");
        expect(result).toEqual({
            MethodName: "GetTicketingPageTOBE",
            channelType: "HO",
            osType: "W",
            osVersion:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
            memberOnNo: "0",
            playDate: "",
            cinemaID: "",
            representationMovieCode: "",
        });
    });

    test("MEGABOX - 기본 형식", () => {
        const result = bodyGenerator.bodyGenerator("M");
        expect(result).toEqual({
            playDe: "19700101",
            incomeMovieNo: "",
            onLoad: "Y",
            sellChnlCd: "",
            incomeTheabKindCd: "",
            incomeBrchNo1: "",
            incomePlayDe: "",
        });
    });
});
