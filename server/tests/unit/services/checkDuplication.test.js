require("../../../src/utils/errorLogger");
const cinemalarmModel = require("../../../src/models/cinemalarm");
const {
    checkDuplication,
} = require("../../../src/services/v1/alarmCine/checkDuplication");

jest.mock("../../../src/models/cinemalarm");

describe("checkDuplication 테스트", () => {
    test("checkDuplication은 중복되는 요소가 없으면 true를 반환한다", async () => {
        cinemalarmModel.findOne = jest.fn().mockResolvedValue([]);
        const result = await checkDuplication({});
        expect(result).toBe(true);
    });
    test("checkDuplication은 중복되는 요소가 있으면 false를 반환한다", async () => {
        cinemalarmModel.findOne = jest.fn().mockResolvedValue([{}]);
        const result = await checkDuplication({});
        expect(result).toBe(false);
    });
    test("중복 요소 검색에 실패한 경우 false를 반환한다.", async () => {
        cinemalarmModel.findOne = jest
            .fn()
            .mockRejectedValue(new Error("Database error"));
        const result = await checkDuplication({});
        expect(result).toBe(false);
        expect(cinemalarmModel.findOne).toHaveBeenCalled();
    });
});
