require("../../src/utils/errorLogger");
const { unregister } = require("../../src/services/v1/alarmCine/unregister");
const cinemalarmModel = require("../../src/models/cinemalarm");

jest.mock("../../src/models/cinemalarm", () => {
    const mockModel = jest.fn();
    mockModel.findOne = jest.fn();
    mockModel.deleteOne = jest.fn();
    return mockModel;
});

const objectPreset = {
    uuid: "test",
    multiplex: "",
    date: "1970-01-01",
    cinema: "",
    movie: "test",
    time: "00:00/01:00/test",
};

describe("unregister 테스트", () => {
    test("데이터에 해당하는 알람이 있으면 해제한다 - CGV", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([{}]);
        const object = { ...objectPreset };
        object.multiplex = "C";
        object.cinema = "test";
        const result = await unregister(object);
        expect(result.status).toBe(200);
    });

    test("해당하는 알람이 없으면 오류를 발생시킨다 - CGV", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "C";
        object.cinema = "test";
        const result = await unregister(object);
        expect(result.status).toBe(409);
        expect(result.message).toEqual("Data doesn't exists");
    });

    test("데이터에 해당하는 알람이 있으면 해제한다 - LOTTE CINEMA", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([{}]);
        const object = { ...objectPreset };
        object.multiplex = "L";
        object.cinema = "test|test|test";
        const result = await unregister(object);
        expect(result.status).toBe(200);
    });

    test("해당하는 알람이 없으면 오류를 발생시킨다 - LOTTE CINEMA", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "L";
        object.cinema = "test|test|test";
        const result = await unregister(object);
        expect(result.status).toBe(409);
        expect(result.message).toEqual("Data doesn't exists");
    });

    test("데이터에 해당하는 알람이 있으면 해제한다 - MEGABOX", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([{}]);
        const object = { ...objectPreset };
        object.multiplex = "M";
        object.cinema = "test/test";
        const result = await unregister(object);
        expect(result.status).toBe(200);
    });

    test("해당하는 알람이 없으면 오류를 발생시킨다 - MEGABOX", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "M";
        object.cinema = "test/test";
        const result = await unregister(object);
        expect(result.status).toBe(409);
        expect(result.message).toEqual("Data doesn't exists");
    });

    test("전달된 데이터 중 누락된 항목이 있으면 오류를 발생시킨다", async () => {
        const object = { ...objectPreset };
        const result = await unregister(object);
        expect(result.status).toBe(400);
        expect(result.message).toEqual("Missing required parameters");
    });

    test("데이터의 형식이 올바르지 않으면 오류를 발생시킨다", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([]);
        const object = { ...objectPreset };
        object.multiplex = "M";
        object.cinema = "test|test";
        const result = await unregister(object);
        expect(result.status).toBe(400);
        expect(result.message).toEqual("Invalid form data");
    });

    test("삭제에 실패하면 오류를 발생시킨다", async () => {
        cinemalarmModel.findOne.mockResolvedValueOnce([{}]);
        cinemalarmModel.deleteOne.mockImplementationOnce(() => {
            throw new Error("Simulated delete error");
        });
        const object = { ...objectPreset };
        object.multiplex = "M";
        object.cinema = "test/test";
        const result = await unregister(object);
        expect(result.status).toBe(500);
        expect(result.message).toEqual("Simulated delete error");
    });
});
