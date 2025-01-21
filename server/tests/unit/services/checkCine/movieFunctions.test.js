require("../../../../src/utils/errorLogger");
const {
    movieC,
    movieL,
    movieM,
} = require("../../../../src/services/v1/checkCine/movie");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("movieFunctions 테스트", () => {
    test("movieC는 CGV에서 선택 가능한 영화를 반환한다", async () => {
        const result = await movieC("1970-01-01", "test");
        expect(result).toEqual([]);
    });
    test("movieL는 LOTTE CINEMA에서 선택 가능한 영화를 반환한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                PlaySeqsHeader: {
                    Items: [
                        { RepresentationMovieCode: "test1" },
                        { RepresentationMovieCode: "test2" },
                    ],
                },
            },
        });
        const result = await movieL("1970-01-01", "test|test|test");
        expect(result).toEqual(["test1", "test2"]);
    });
    test("movieL은 잘못된 파라미터 형식에 오류를 발생시킨다", async () => {
        await expect(movieL("1970-01-01", 1234)).rejects.toThrow();
        await expect(movieL("1970-01-01", "test|test")).rejects.toThrow();
    });
    test("movieM는 MEGABOX에서 선택 가능한 영화를 반환한다", async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieList: [
                    { movieNo: "test1", formAt: "Y" },
                    { movieNo: "test2", formAt: "N" },
                ],
                crtnMovieList: [
                    { movieNo: "test3", formAt: "Y" },
                    { movieNo: "test4", formAt: "N" },
                ],
            },
        });
        const result = await movieM("1970-01-01", "test/test");
        expect(result).toEqual(["test1", "test3"]);
    });
    test("movieM은 잘못된 파라미터 형식에 오류를 발생시킨다", async () => {
        await expect(movieM("1970-01-01", 1234)).rejects.toThrow();
        await expect(movieM("1970-01-01", "test")).rejects.toThrow();
    });
    test("movieFunctions는 잘못된 요청에 대해서 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });

        const resultC = await movieC("1970-01-01", "");
        const resultL = await movieL("1970-01-01", "test|test|test");
        const resultM = await movieM("1970-01-01", "test/test");

        expect(resultC).toEqual([]);
        expect(resultL).toEqual([]);
        expect(resultM).toEqual([]);
    });
});
