require("../../../src/utils/errorLogger");
const {
    timeC,
    timeL,
    timeM,
} = require("../../../src/services/v1/checkCine/time");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("timeFunctions 테스트", () => {
    test("timeC는 CGV에서 선택 가능한 시간을 반환한다", async () => {
        const result = await timeC("1970-01-01", "test", "test");
        expect(result).toEqual([]);
    });
    test("timeL는 LOTTECINEMA에서 선택 가능한 시간을 반환한다", async () => {
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
        const result = await timeL("1970-01-01", "test|test|test", "test");
        expect(result).toEqual(["00:00/01:00/1", "01:00/02:00/2"]);
    });
    test("timeL은 잘못된 파리미터 형식에 오류를 발생시킨다", async () => {
        await expect(timeL("1970-01-01", 1234, "test")).rejects.toThrow();
        await expect(
            timeL("1970-01-01", "test|test", "test")
        ).rejects.toThrow();
    });
    test("timeM는 MEGABOX에서 선택 가능한 시간을 반환한다", async () => {
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
        const result = await timeM("1970-01-01", "test/test", "test");
        expect(result).toEqual(["00:00/01:00/1", "01:00/02:00/2"]);
    });
    test("timeM은 잘못된 파리미터 형식에 오류를 발생시킨다", async () => {
        await expect(timeL("1970-01-01", 1234, "test")).rejects.toThrow();
        await expect(
            timeL("1970-01-01", "test|test", "test")
        ).rejects.toThrow();
    });
    test("timeFunctions는 잘못된 요청에 대해서 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });

        const resultC = await timeC("1970-01-01", "", "test");
        const resultL = await timeL("1970-01-01", "test|test|test", "test");
        const resultM = await timeM("1970-01-01", "test/test", "test");

        expect(resultC).toEqual([]);
        expect(resultL).toEqual([]);
        expect(resultM).toEqual([]);
    });
});
