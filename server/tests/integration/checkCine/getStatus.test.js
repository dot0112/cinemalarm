const { getStatus } = require("../../../src/services/v1/checkCine/stat");
const axios = require("axios");
jest.mock("axios");

global.errorLogger = jest.fn();
global.bodyGenerator = jest.fn();

describe("getStatus 통합 테스트", () => {
    beforeEach(() => {
        global.errorLogger.mockClear();
    });

    test("모든 API의 동작 여부를 확인한다", async () => {
        axios.post
            .mockResolvedValueOnce({ status: 200 })
            .mockResolvedValueOnce({ status: 200 })
            .mockResolvedValueOnce({ status: 200 });

        global.bodyGenerator
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        const result = await getStatus();

        expect(global.errorLogger).not.toHaveBeenCalled();

        expect(result.status).toBe(200);
        expect(result.data.result).toEqual({ C: false, L: true, M: true });
    });

    test("실패한 API를 처리한다", async () => {
        // 첫 번째는 성공, 두 번째는 실패
        axios.post
            .mockResolvedValueOnce({ status: 200 })
            .mockRejectedValueOnce(new Error("API 오류"))
            .mockResolvedValueOnce({ status: 200 });

        const result = await getStatus();

        // 결과는 { C: false(구현 전), L: false, M: true }
        expect(result.status).toBe(200);
        expect(result.data.result).toEqual({ C: false, L: false, M: true });
    });
});
