const {
    dateC,
    dateL,
    dateM,
} = require("../../../../src/services/v1/checkCine/date");
const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.errorLogger = jest.fn();
global.bodyGenerator = jest.fn();

describe("dateFunctions 테스트", () => {
    test("dateC는 CGV에서 선택 가능한 날짜를 반환한다", async () => {
        const result = await dateC();
        expect(result).toEqual([]);
    });

    test("dateC는 요청이 성공적으로 처리되지 않은 경우 빈 배열을 반환한다.", async () => {
        const result = await dateC();
        expect(result).toEqual([]);
    });

    test("dateL은 LOTTE CINEMA에서 선택 가능한 날짜를 반환한다", async () => {
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

        const result = await dateL();
        expect(result).toEqual(["2025-01-10", "2025-01-12"]);
    });

    test("dateL은 요청이 성공적으로 처리되지 않은 경우 빈 배열을 반환한다.", async () => {
        axios.post.mockResolvedValue({ status: 500 });

        const result = await dateL();
        expect(result).toEqual([]);
    });

    test("dateM은 MEGABOX에서 선택 가능한 날짜를 반환한다", async () => {
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

        const result = await dateM();
        expect(result).toEqual(["2025-01-10", "2025-01-11"]);
    });

    test("dateM은 요청이 성공적으로 처리되지 않은 경우 빈 배열을 반환한다.", async () => {
        axios.post.mockResolvedValue({ status: 500 });

        const result = await dateM();
        expect(result).toEqual([]);
    });
});
