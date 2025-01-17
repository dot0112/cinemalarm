require("../../../src/utils/errorLogger");
const {
    cinemaC,
    cinemaL,
    cinemaM,
} = require("../../../src/services/v1/checkCine/cinema");
const cinemaLModel = require("../../../src/models/cinema/cinemaL");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");
jest.mock("../../../src/models/cinema/cinemaL");

global.bodyGenerator = jest.fn();

describe("cinemaFunctions 테스트", () => {
    test("cinemaC는 CGV에서 선택 가능한 지점을 반환한다", async () => {
        const result = await cinemaC("1970-01-01");
        expect(result).toEqual([]);
    });
    test("cinemaL는 LOTTE CINEMA에서 선택 가능한 지점을 반환한다", async () => {
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
        const result = await cinemaL("1970-01-01");
        expect(result).toEqual(["1|test1|1", "3|test3|3"]);
    });
    test("cinemaM는 MEGABOX에서 선택 가능한 지점을 반환한다", async () => {
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
        const result = await cinemaM("1970-01-01");
        expect(result).toEqual(["test1/test1", "test4/test4"]);
    });
    test("cinemaFunctions는 잘못된 요청에 대해서 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });

        const resultC = await cinemaC("1970-01-01");
        const resultL = await cinemaL("1970-01-01");
        const resultM = await cinemaM("1970-01-01");

        expect(resultC).toEqual([]);
        expect(resultL).toEqual([]);
        expect(resultM).toEqual([]);
    });
});
