require("../../../src/utils/errorLogger");
const { getMovies } = require("../../../src/services/v1/checkCine/movie");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("getMovies 테스트", () => {
    test("CGV의 선택 가능 영화를 확인한다", async () => {
        const result = await getMovies("C", "1970-01-01", "test");
        expect(result).toEqual({ movie: [] });
    });

    test("LOTTE CINEMA의 선택 가능 영화를 확인한다", async () => {
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
        const result = await getMovies("L", "1970-01-01", "test|test|test");
        expect(result).toEqual({ movie: ["test1", "test2"] });
    });

    test("MEGABOX의 선택 가능 영화를 확인한다", async () => {
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
        const result = await getMovies("M", "1970-01-01", "test/test");
        expect(result).toEqual({ movie: ["test1", "test3"] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - Multiplex 기호", async () => {
        const result = await getMovies("Invalid move", "1970-01-01", "test");
        expect(result).toEqual({ movie: [] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - 날짜 형식", async () => {
        const resultC = await getMovies("C", "19700101", "test");
        const resultL = await getMovies("L", "19700101", "test|test|test");
        const resultM = await getMovies("M", "19700101", "test/test");
        expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - 지점 형식", async () => {
        // const resultC = await getMovies("C", "1970-01-01", ""); - 미구현
        const resultL = await getMovies("L", "1970-01-01", "");
        const resultM = await getMovies("M", "1970-01-01", "");
        // expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });

    test("잘못된 반환에 대해 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        const resultC = await getMovies("C", "1970-01-01", "");
        const resultL = await getMovies("L", "1970-01-01", "test|test|test");
        const resultM = await getMovies("M", "1970-01-01", "test/test");
        expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });
});
