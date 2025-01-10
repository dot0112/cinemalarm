global.errorLogger = jest.fn();
global.bodyGenerator = jest.fn();
const statService = require("../../src/services/v1/checkCine/stat");
const axios = require("axios");
jest.mock("axios");

describe("getStatus 통합 테스트", () => {
    test("모든 API의 동작 여부를 확인한다", async () => {
        // mock 된 axios의 응답
        axios.post
            .mockResolvedValueOnce({ status: 200 })
            .mockResolvedValueOnce({ status: 200 })
            .mockResolvedValueOnce({ status: 200 });

        const result = await statService.getStatus();

        // 결과가 { C: false(구현 전), L: true, M: true }일 것이라 예상
        expect(result).toEqual({ C: false, L: true, M: true });
    });

    test("실패한 API를 처리한다", async () => {
        // 첫 번째는 성공, 두 번째는 실패
        axios.post
            .mockResolvedValueOnce({ status: 200 })
            .mockRejectedValueOnce(new Error("API 오류"))
            .mockResolvedValueOnce({ status: 200 });

        const result = await statService.getStatus();

        // 결과는 { C: false(구현 전), L: false, M: true }
        expect(result).toEqual({ C: false, L: false, M: true });
    });
});
