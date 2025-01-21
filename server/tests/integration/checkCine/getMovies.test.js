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
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("C");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test");
        expect(result.data.result).toEqual({ movie: [] });
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

        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("L");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test|test|test");
        expect(result.data.result).toEqual({ movie: ["test1", "test2"] });
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
        expect(result.status).toBe(200);
        expect(result.data.mode).toBe("M");
        expect(result.data.date).toEqual("1970-01-01");
        expect(result.data.cinema).toEqual("test/test");
        expect(result.data.result).toEqual({ movie: ["test1", "test3"] });
    });

    test("잘못된 요청에 대해 오류를 발생시킨다 - Multiplex 기호", async () => {
        try {
            await getMovies({
                mode: "Invalid mode",
                date: "1970-01-01",
                cinema: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toEqual("Invalid mode: Invalid mode");
        }
    });

    test("잘못된 요청에 대해 오류를 발생시킨다 - 날짜 형식", async () => {
        try {
            await getMovies({
                mode: "C",
                date: "19700101",
                cinema: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
        try {
            await getMovies({
                mode: "L",
                date: "19700101",
                cinema: "test|test|test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
        try {
            await getMovies({
                mode: "M",
                date: "19700101",
                cinema: "test/test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe(
                "Invalid date format. Expected format: YYYY-MM-DD, Received data: 19700101"
            );
        }
    });

    test("잘못된 요청에 대해 오류를 발생시킨다 - 지점 형식", async () => {
        // const resultC = await getMovies("C", "1970-01-01", ""); - 미구현
        try {
            await getMovies({
                mode: "L",
                date: "1970-01-01",
                cinema: "",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe("Invalid cinema ID: ");
        }
        try {
            await getMovies({
                mode: "M",
                date: "1970-01-01",
                cinema: "",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe("Invalid cinema ID: ");
        }
    });

    test("잘못된 반환에 대해 오류를 발생시킨다", async () => {
        axios.post.mockResolvedValue({ status: 500 });
        try {
            await getMovies({
                mode: "C",
                date: "1970-01-01",
                cinema: "test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe("Failed to retrieve movie data");
        }
        try {
            await getMovies({
                mode: "L",
                date: "1970-01-01",
                cinema: "test|test|test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe("Failed to retrieve movie data");
        }
        try {
            await getMovies({
                mode: "M",
                date: "1970-01-01",
                cinema: "test/test",
            });
        } catch (err) {
            expect(err.status).toBe(400);
            expect(err.message).toBe("Failed to retrieve movie data");
        }
    });
});
