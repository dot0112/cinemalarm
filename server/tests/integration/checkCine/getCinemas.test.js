require("../../../src/utils/errorLogger");
const { getCinemas } = require("../../../src/services/v1/checkCine/cinema");
const cinemaLModel = require("../../../src/models/cinema/cinemaL");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");
jest.mock("../../../src/models/cinema/cinemaL");

global.bodyGenerator = jest.fn();

describe("getCinemas 테스트", () => {
    test("CGV의 선택 가능 지점을 확인한다", async () => {
        const result = await getCinemas({ mode: "C", date: "1970-01-01" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("C");
        expect(result.data.date).toBe("1970-01-01");
        expect(result.data.result).toEqual({ cinema: [] });
    });
    test("LOTTE CINEMA의 선택 가능 지점을 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                Cinemas: {
                    Items: [
                        {
                            DivisionCode: 2,
                            DetailDivisionCode: "test2",
                            CinemaID: 2,
                        },
                    ],
                },
            },
        });
        cinemaLModel.find = jest.fn().mockResolvedValue([
            { DivisionCode: 1, DetailDivisionCode: "test1", CinemaID: 1 },
            { DivisionCode: 2, DetailDivisionCode: "test2", CinemaID: 2 },
            { DivisionCode: 3, DetailDivisionCode: "test3", CinemaID: 3 },
        ]);
        const result = await getCinemas({ mode: "L", date: "1970-01-01" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("L");
        expect(result.data.date).toBe("1970-01-01");
        expect(result.data.result).toEqual({
            cinema: ["1|test1|1", "3|test3|3"],
        });
    });
    test("MEGABOX의 선택 가능 지점을 확인한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                areaBrchList: [
                    { areaCd: "test1", brchNo: "test1", brchFormAt: "Y" },
                    { areaCd: "test2", brchNo: "test2", brchFormAt: "N" },
                ],
                spclbBrchList: [
                    { areaCd: "test3", brchNo: "test3", brchFormAt: "N" },
                    { areaCd: "test4", brchNo: "test4", brchFormAt: "Y" },
                ],
            },
        });
        const result = await getCinemas({ mode: "M", date: "1970-01-01" });
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("M");
        expect(result.data.date).toBe("1970-01-01");
        expect(result.data.result).toEqual({
            cinema: ["test1/test1", "test4/test4"],
        });
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - Multiplex 기호", async () => {
        try {
            await getCinemas({
                mode: "Test",
                date: "1970-01-01",
            });
        } catch (err) {
            expect(err.status).toBe(400);
        }
    });
    test("잘못된 요청에 대해 오류를 발생시킨다 - 날짜 형식", async () => {
        try {
            await getCinemas({ mode: "C", date: "19700101" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                `Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101`
            );
        }
        try {
            const resultL = await getCinemas({ mode: "L", date: "19700101" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                `Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101`
            );
        }
        try {
            const resultM = await getCinemas({ mode: "M", date: "19700101" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(
                `Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101`
            );
        }
    });

    test("잘못된 반환에 대해 오류를 발생시킨다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        try {
            await getCinemas({ mode: "C", date: "1970-01-01" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(`Failed to retrieve cinema data`);
        }
        try {
            await getCinemas({ mode: "L", date: "1970-01-01" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual(`Failed to retrieve cinema data`);
        }
        try {
            await getCinemas({ mode: "M", date: "1970-01-01" });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Failed to retrieve cinema data");
        }
    });
});
