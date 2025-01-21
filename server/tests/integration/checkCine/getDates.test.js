const { getDates } = require("../../../src/services/v1/checkCine/date");
const axios = require("axios");
jest.mock("axios");

global.errorLogger = jest.fn();
global.bodyGenerator = jest.fn();

describe("getDates 통합 테스트", () => {
    beforeEach(() => {
        global.errorLogger.mockClear();
    });

    test("CGV의 상영 날짜 리스트를 확인한다", async () => {
        const result = await getDates({ mode: "C" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("C");
        expect(result.data.result).toEqual({ date: [] });
    });

    test("LOTTE CINEMA의 상영 날짜 리스트를 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                MoviePlayDates: {
                    Items: {
                        Items: [
                            {
                                PlayDate: "2025-01-10",
                                IsPlayDate: "Y",
                            },
                            {
                                PlayDate: "2025-01-11",
                                IsPlayDate: "N",
                            },
                            {
                                PlayDate: "2025-01-12",
                                IsPlayDate: "Y",
                            },
                        ],
                    },
                },
            },
        });

        global.bodyGenerator.mockResolvedValueOnce({});

        const result = await getDates({ mode: "L" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("L");
        expect(result.data.result).toEqual({
            date: ["2025-01-10", "2025-01-12"],
        });
    });

    test("MEGABOX의 상영 날짜 리스트를 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieFormDeList: [
                    {
                        playDe: "20250110",
                    },
                    {
                        playDe: "20250111",
                    },
                ],
            },
        });

        global.bodyGenerator.mockResolvedValueOnce({});

        const result = await getDates({ mode: "M" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("M");
        expect(result.data.result).toEqual({
            date: ["2025-01-10", "2025-01-11"],
        });
    });

    test("잘못된 호출에 대한 예외 처리를 확인한다", async () => {
        try {
            await getDates({ mode: "Fail" });
        } catch (err) {
            expect(global.errorLogger).toHaveBeenCalled();
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid mode: Fail");
        }
    });
});
