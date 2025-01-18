require("../../src/utils/errorLogger");
const { getTimes } = require("../../src/services/v1/checkCine/time");

const axios = require("axios");
const FomrData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("getTimes 테스트", () => {
    test("CGV의 선택 가능 시간을 확인한다", async () => {
        const result = await getTimes("C", "1970-01-01", "test", "test");
        expect(result).toEqual({ time: [] });
    });
    test("LOTTE CINEMA의 선택 가능 시간을 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                PlaySeqs: {
                    Items: [
                        {
                            StartTime: "00:00",
                            EndTime: "01:00",
                            PlaySequence: "1",
                        },
                        {
                            StartTime: "01:00",
                            EndTime: "02:00",
                            PlaySequence: "2",
                        },
                    ],
                },
            },
        });
        const result = await getTimes(
            "L",
            "1970-01-01",
            "test|test|test",
            "test"
        );
        expect(result).toEqual({ time: ["00:00/01:00/1", "01:00/02:00/2"] });
    });
    test("MEGABOX의 선택 가능 시간을 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieFormList: [
                    {
                        playStartTime: "00:00",
                        playEndTime: "01:00",
                        playSchdlNo: 1,
                    },
                    {
                        playStartTime: "01:00",
                        playEndTime: "02:00",
                        playSchdlNo: 2,
                    },
                ],
            },
        });
        const result = await getTimes("M", "1970-01-01", "test/test", "test");
        expect(result).toEqual({ time: ["00:00/01:00/1", "01:00/02:00/2"] });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - Multiplex 기호", async () => {
        const result = await getTimes(
            "Invalid move",
            "1970-01-01",
            "test",
            "test"
        );
        expect(result).toEqual({ time: [] });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - 날짜 형식", async () => {
        const resultC = await getTimes("C", "19700101", "test", "test");
        const resultL = await getTimes(
            "L",
            "19700101",
            "test|test|test",
            "test"
        );
        const resultM = await getTimes("M", "19700101", "test/test", "test");
        expect(resultC).toEqual({ time: [] });
        expect(resultL).toEqual({ time: [] });
        expect(resultM).toEqual({ time: [] });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - 지점 형식", async () => {
        // const resultC = await getTimes("C", "1970-01-01", "test", "test"); - 미구현
        const resultL = await getTimes("L", "1970-01-01", "test|test", "test");
        const resultM = await getTimes("M", "1970-01-01", "test", "test");
        // expect(resultC).toEqual({ time: [] });
        expect(resultL).toEqual({ time: [] });
        expect(resultM).toEqual({ time: [] });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - 영화 형식", async () => {
        const resultC = await getTimes("C", "1970-01-01", "test", 1234);
        const resultL = await getTimes(
            "L",
            "1970-01-01",
            "test|test|test",
            5678
        );
        const resultM = await getTimes("M", "1970-01-01", "test/test", 9999);
        expect(resultC).toEqual({ time: [] });
        expect(resultL).toEqual({ time: [] });
        expect(resultM).toEqual({ time: [] });
    });
    test("잘못된 반환에 대해 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        const resultC = await getTimes("C", "1970-01-01", "test", "test");
        const resultL = await getTimes(
            "L",
            "1970-01-01",
            "test|test|test",
            "test"
        );
        const resultM = await getTimes("M", "1970-01-01", "test/test", "test");
        expect(resultC).toEqual({ time: [] });
        expect(resultL).toEqual({ time: [] });
        expect(resultM).toEqual({ time: [] });
    });
});
