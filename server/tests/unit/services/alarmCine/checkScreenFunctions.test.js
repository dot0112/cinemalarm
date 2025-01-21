require("../../../../src/utils/errorLogger");
const {
    checkScreenC,
    checkScreenL,
    checkScreenM,
} = require("../../../../src/services/v1/alarmCine/checkAvailableScreen");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

global.bodyGenerator = jest.fn();

const object = {
    date: "test",
    cinema: "test/test",
    movie: "test",
    time: "00:00/01:00/test1",
};

describe("checkScreenFunctions 테스트", () => {
    test("checkScreenC는 CGV에서 해당 회차가 존재하는지 확인한다", async () => {
        const result = await checkScreenC(object);
        expect(result).toBe(true);
    });
    test("checkScreenC는 잘못된 응답에 대해 false를 반환한다.", async () => {
        // 미구현
    });
    test("checkScreenL는 LOTTE CINEMA에서 해당 회차가 존재하는지 확인한다", async () => {
        axios.post
            .mockResolvedValueOnce({
                status: 200,
                data: {
                    PlaySeqs: {
                        Items: [{ PlaySequence: "test1" }],
                    },
                },
            })
            .mockResolvedValueOnce({
                status: 200,
                data: {
                    PlaySeqs: {
                        Items: [{ PlaySequence: "test2" }],
                    },
                },
            });
        const result1 = await checkScreenL(object);
        const result2 = await checkScreenL(object);
        expect(result1).toBe(true);
        expect(result2).toBe(false);
    });
    test("checkScreenL는 잘못된 응답에 대해 false를 반환한다.", async () => {
        axios.post.mockResolvedValueOnce({
            status: 500,
        });
        const result = await checkScreenL(object);
        expect(result).toBe(false);
    });
    test("checkScreenM는 MEGABOX에서 해당 회차가 존재하는지 확인한다", async () => {
        axios.post
            .mockResolvedValueOnce({
                status: 200,
                data: {
                    movieFormList: [{ playSchdlNo: "test1" }],
                },
            })
            .mockResolvedValueOnce({
                status: 200,
                data: {
                    movieFormList: [{ playSchdlNo: "test2" }],
                },
            });
        const result1 = await checkScreenM(object);
        const result2 = await checkScreenM(object);
        expect(result1).toBe(true);
        expect(result2).toBe(false);
    });
    test("checkScreenM는 잘못된 응답에 대해 false를 반환한다.", async () => {
        axios.post.mockResolvedValueOnce({
            status: 500,
        });
        const result = await checkScreenM(object);
        expect(result).toBe(false);
    });
});
