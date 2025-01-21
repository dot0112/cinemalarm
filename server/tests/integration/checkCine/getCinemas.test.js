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
        expect(result).toEqual({ cinema: [] });
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
        expect(result).toEqual({ cinema: ["1|test1|1", "3|test3|3"] });
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
        expect(result).toEqual({
            cinema: ["test1/test1", "test4/test4"],
        });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - Multiplex 기호", async () => {
        const result = await getCinemas({ mode: "Test", date: "1970-01-01" });
        expect(result).toEqual({
            cinema: [],
        });
    });
    test("잘못된 요청에 대해 빈 배열을 반환한다 - 날짜 형식", async () => {
        const resultC = await getCinemas({ mode: "C", date: "19700101" });
        const resultL = await getCinemas({ mode: "L", date: "19700101" });
        const resultM = await getCinemas({ mode: "M", date: "19700101" });
        expect(resultC).toEqual({
            cinema: [],
        });
        expect(resultL).toEqual({
            cinema: [],
        });
        expect(resultM).toEqual({
            cinema: [],
        });
    });
    test("잘못된 반환에 대해 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        const resultC = await getCinemas({ mode: "C", date: "1970-01-01" });
        const resultL = await getCinemas({ mode: "L", date: "1970-01-01" });
        const resultM = await getCinemas({ mode: "M", date: "1970-01-01" });
        expect(resultC).toEqual({
            cinema: [],
        });
        expect(resultL).toEqual({
            cinema: [],
        });
        expect(resultM).toEqual({
            cinema: [],
        });
    });
});
