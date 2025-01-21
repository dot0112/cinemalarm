require("../../../src/utils/errorLogger");
const { getTimes } = require("../../../src/services/v1/checkCine/time");

const axios = require("axios");
const FomrData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("getTimes 테스트", () => {
    test("CGV의 선택 가능 시간을 확인한다", async () => {
        const result = await getTimes({
            mode: "C",
            date: "1970-01-01",
            cinema: "test",
            movie: "test",
        });

        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("C");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test");
        expect(result.data.movie).toEqual("test");
        expect(result.data.result).toEqual({ time: [] });
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
        const result = await getTimes({
            mode: "L",
            date: "1970-01-01",
            cinema: "test|test|test",
            movie: "test",
        });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("L");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test|test|test");
        expect(result.data.movie).toEqual("test");
        expect(result.data.result).toEqual({
            time: ["00:00/01:00/1", "01:00/02:00/2"],
        });
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
        const result = await getTimes({
            mode: "M",
            date: "1970-01-01",
            cinema: "test/test",
            movie: "test",
        });

        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("M");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test/test");
        expect(result.data.movie).toEqual("test");
        expect(result.data.result).toEqual({
            time: ["00:00/01:00/1", "01:00/02:00/2"],
        });
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - Multiplex 기호", async () => {
        try {
            await getTimes({
                mode: "Invalid mode",
                date: "1970-01-01",
                cinema: "test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid mode: Invalid mode");
        }
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - 날짜 형식", async () => {
        try {
            await getTimes({
                mode: "C",
                date: "19700101",
                cinema: "test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
        try {
            await getTimes({
                mode: "L",
                date: "19700101",
                cinema: "test|test|test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
        try {
            await getTimes({
                mode: "M",
                date: "19700101",
                cinema: "test/test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - 지점 형식", async () => {
        // const resultC = await getTimes("C", "1970-01-01", "test", "test"); - 미구현
        try {
            const resultL = await getTimes({
                mode: "L",
                date: "1970-01-01",
                cinema: "test|test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                "Invalid cinema format. Expected format: {DivisionCode}|{DetailDivisionCode}|{CinemaID}, Received data: test|test"
            );
        }
        try {
            const resultM = await getTimes({
                mode: "M",
                date: "1970-01-01",
                cinema: "test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                "Invalid cinema format. Expected format: {areaCd}/{brchNo}, Received data: test"
            );
        }
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - 영화 형식", async () => {
        try {
            await getTimes({
                mode: "C",
                date: "1970-01-01",
                cinema: "test",
                movie: 1234,
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid movie ID: 1234");
        }
        try {
            await getTimes({
                mode: "L",
                date: "1970-01-01",
                cinema: "test|test|test",
                movie: 5678,
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid movie ID: 5678");
        }
        try {
            await getTimes({
                mode: "M",
                date: "1970-01-01",
                cinema: "test/test",
                movie: 9999,
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid movie ID: 9999");
        }
    });
    test("잘못된 반환에 대해 오류를 발생시킨다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        try {
            await getTimes({
                mode: "C",
                date: "1970-01-01",
                cinema: "test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Failed to retrieve time data");
        }
        try {
            await getTimes({
                mode: "L",
                date: "1970-01-01",
                cinema: "test|test|test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Failed to retrieve time data");
        }
        try {
            await getTimes({
                mode: "M",
                date: "1970-01-01",
                cinema: "test/test",
                movie: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Failed to retrieve time data");
        }
    });
});
