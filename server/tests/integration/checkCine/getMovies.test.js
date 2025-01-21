require("../../../src/utils/errorLogger");
const { getMovies } = require("../../../src/services/v1/checkCine/movie");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

describe("getMovies 테스트", () => {
    test("CGV의 선택 가능 영화를 확인한다", async () => {
        const result = await getMovies({
            mode: "C",
            date: "1970-01-01",
            cinema: "test",
        });
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
        const result = await getMovies({
            mode: "L",
            date: "1970-01-01",
            cinema: "test|test|test",
        });
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
        const result = await getMovies({
            mode: "M",
            date: "1970-01-01",
            cinema: "test/test",
        });
        expect(result).toEqual({ movie: ["test1", "test3"] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - Multiplex 기호", async () => {
        const result = await getMovies({
            mode: "Invalid mode",
            date: "1970-01-01",
            cinema: "test",
        });
        expect(result).toEqual({ movie: [] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - 날짜 형식", async () => {
        const resultC = await getMovies({
            mode: "C",
            date: "19700101",
            cinema: "test",
        });
        const resultL = await getMovies({
            mode: "L",
            date: "19700101",
            cinema: "test|test|test",
        });
        const resultM = await getMovies({
            mode: "M",
            date: "19700101",
            cinema: "test/test",
        });
        expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });

    test("잘못된 요청에 대해 빈 배열을 반환한다 - 지점 형식", async () => {
        // const resultC = await getMovies("C", "1970-01-01", ""); - 미구현
        const resultL = await getMovies({
            mode: "L",
            date: "1970-01-01",
            cinema: "",
        });
        const resultM = await getMovies({
            mode: "M",
            date: "1970-01-01",
            cinema: "",
        });
        // expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });

    test("잘못된 반환에 대해 빈 배열을 반환한다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        const resultC = await getMovies({
            mode: "C",
            date: "1970-01-01",
            cinema: "",
        });
        const resultL = await getMovies({
            mode: "L",
            date: "1970-01-01",
            cinema: "test|test|test",
        });
        const resultM = await getMovies({
            mode: "M",
            date: "1970-01-01",
            cinema: "test/test",
        });
        expect(resultC).toEqual({ movie: [] });
        expect(resultL).toEqual({ movie: [] });
        expect(resultM).toEqual({ movie: [] });
    });
});
