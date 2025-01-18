require("../../src/utils/errorLogger");
const { register } = require("../../src/services/v1/alarmCine/register");
const cinemalarmModel = require("../../src/models/cinemalarm");

const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios");
jest.mock("form-data");

jest.mock("../../src/models/cinemalarm", () => {
    const mockModel = jest.fn();
    mockModel.findOne = jest.fn();
    return mockModel;
});

const mockSave = jest.fn();

cinemalarmModel.mockImplementation(() => {
    return {
        save: mockSave,
    };
});

global.bodyGenerator = jest.fn();

const objectPreset = {
    uuid: "test",
    multiplex: "",
    date: "1970-01-01",
    cinema: "",
    movie: "test",
    time: "00:00/01:00/test",
};

describe("register 테스트", () => {
    test("register은 전달받은 데이터로 알람을 Db에 저장한다 - CGV", async () => {
        axios.post.mockResolvedValue({ status: 200 });
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "C";
        object.cinema = "test";
        const result = await register(object);
        expect(result.status).toBe(200);
        expect(cinemalarmModel.findOne).toHaveBeenCalled();

        expect(cinemalarmModel).toHaveBeenCalledWith({
            hash: expect.any(String),
            uuid: object.uuid,
            multiplex: object.multiplex,
            date: object.date,
            cinema: object.cinema,
            movie: object.movie,
            time: object.time,
        });

        expect(mockSave).toHaveBeenCalled();
    });

    test("register은 전달받은 데이터로 알람을 Db에 저장한다 - LOTTE CINEMA", async () => {
        axios.post.mockResolvedValue({ status: 200 }).mockResolvedValueOnce({
            status: 200,
            data: {
                PlaySeqs: {
                    Items: [{ PlaySequence: "test" }],
                },
            },
        });
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "L";
        object.cinema = "test|test|test";
        const result = await register(object);
        expect(result.status).toBe(200);
        expect(axios.post).toHaveBeenCalled();
        expect(cinemalarmModel.findOne).toHaveBeenCalled();

        expect(cinemalarmModel).toHaveBeenCalledWith({
            hash: expect.any(String),
            uuid: object.uuid,
            multiplex: object.multiplex,
            date: object.date,
            cinema: object.cinema,
            movie: object.movie,
            time: object.time,
        });

        expect(mockSave).toHaveBeenCalled();
    });

    test("register은 전달받은 데이터로 알람을 Db에 저장한다 - MEGABOX", async () => {
        axios.post.mockResolvedValue({ status: 200 }).mockResolvedValueOnce({
            status: 200,
            data: {
                movieFormList: [{ playSchdlNo: "test" }],
            },
        });
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "M";
        object.cinema = "test/test";
        const result = await register(object);
        expect(result.status).toBe(200);
        expect(axios.post).toHaveBeenCalled();
        expect(cinemalarmModel.findOne).toHaveBeenCalled();

        expect(cinemalarmModel).toHaveBeenCalledWith({
            hash: expect.any(String),
            uuid: object.uuid,
            multiplex: object.multiplex,
            date: object.date,
            cinema: object.cinema,
            movie: object.movie,
            time: object.time,
        });

        expect(mockSave).toHaveBeenCalled();
    });

    test("Parameters가 부족하면 오류를 발생시킨다", async () => {
        const object = { ...objectPreset };
        const result = await register(object);
        expect(result.status).toBe(400);
    });

    test("Parameter 형식이 유효하지 않으면 오류를 발생시킨다", async () => {
        const object = { ...objectPreset };

        object.multiplex = "L";
        object.cinema = "test/test";
        const resultL = await register(object);

        object.multiplex = "M";
        object.cinema = "test|test|test";
        const resultM = await register(object);

        expect(resultL.status).toBe(400);
        expect(resultL.message).toEqual("Invalid form data");
        expect(resultM.status).toBe(400);
        expect(resultM.message).toEqual("Invalid form data");
    });

    test("중복된 알람이면 오류를 발생시킨다", async () => {
        cinemalarmModel.findOne.mockResolvedValue([{}]);

        const object = { ...objectPreset };

        object.multiplex = "L";
        object.cinema = "test|test|test";
        const resultL = await register(object);

        object.multiplex = "M";
        object.cinema = "test/test";
        const resultM = await register(object);

        expect(resultL.status).toBe(409);
        expect(resultL.message).toEqual("Duplicate data exists");
        expect(resultM.status).toBe(409);
        expect(resultM.message).toEqual("Duplicate data exists");
    });

    test("존재하지 않는 회차이면 오류를 발생시킨다", async () => {
        cinemalarmModel.findOne.mockResolvedValue([]);
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieFormList: [{ playSchdlNo: "test1" }],
                PlaySeqs: {
                    Items: [{ PlaySequence: "test1" }],
                },
            },
        });

        const object = { ...objectPreset };

        object.multiplex = "L";
        object.cinema = "test|test|test";
        const resultL = await register(object);

        object.multiplex = "M";
        object.cinema = "test/test";
        const resultM = await register(object);

        expect(resultL.status).toBe(400);
        expect(resultL.message).toEqual("Screen not available");
        expect(resultM.status).toBe(400);
        expect(resultM.message).toEqual("Screen not available");
    });

    test("알람을 Db에 저장하는데 실패하면 오류를 발생시킨다", async () => {
        cinemalarmModel.findOne.mockResolvedValue([]);
        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieFormList: [{ playSchdlNo: "test" }],
                PlaySeqs: {
                    Items: [{ PlaySequence: "test" }],
                },
            },
        });

        mockSave.mockRejectedValue(new Error("Database save failed"));

        const object = { ...objectPreset };

        object.multiplex = "L";
        object.cinema = "test|test|test";
        const resultL = await register(object);

        object.multiplex = "M";
        object.cinema = "test/test";
        const resultM = await register(object);

        expect(resultL.status).toBe(500);
        expect(resultL.message).toEqual("Database save failed");
        expect(resultM.status).toBe(500);
        expect(resultM.message).toEqual("Database save failed");
    });
});
