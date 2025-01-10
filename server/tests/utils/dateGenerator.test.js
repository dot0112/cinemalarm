const dateGenerator = require("../../src/utils/dateGenerator");

describe("dateGenerator 테스트", () => {
    beforeAll(() => {
        const mockDate = new Date(2025, 0, 10, 21, 0);
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    });

    test("LOTTE CINEMA - 현재 날짜", () => {
        const result = dateGenerator.dateGenerator("L");
        expect(result).toEqual("2025-01-10");
    });

    test("LOTTE CINEMA - 특정 날짜", () => {
        const result = dateGenerator.dateGenerator("L", "1970", "1", "1");
        expect(result).toEqual("1970-01-01");
    });

    test("MEGABOX - 현재 날짜", () => {
        const result = dateGenerator.dateGenerator("M");
        expect(result).toEqual("20250110");
    });

    test("MEGABOX - 특정 날짜", () => {
        const result = dateGenerator.dateGenerator("M", "1970", "1", "1");
        expect(result).toEqual("19700101");
    });
});
