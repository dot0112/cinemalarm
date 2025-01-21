require("../../../../src/utils/errorLogger");
const {
    checkFormC,
    checkFormL,
    checkFormM,
} = require("../../../../src/services/v1/alarmCine/checkValidForm");

describe("checkFormFunctions 테스트", () => {
    test("checkFormC는 입력된 데이터가 CGV API의 형식에 맞는지 확인한다", () => {
        const object = {
            cinema: "test",
            movie: "test",
            time: "test",
        };
        const result = checkFormC(object);
        expect(result).toBe(true);
    });
    test("checkFormC는 잘못된 형식에 대해 false를 반환한다", () => {
        const object = {
            cinema: "",
            movie: "test",
            time: "test",
        };
        const result = checkFormC(object);
        expect(result).toBe(false);
    });
    test("checkFormL는 입력된 데이터가 LOTTE CINEMA API의 형식에 맞는지 확인한다", () => {
        const object = {
            cinema: "test|test|test",
            movie: "test",
            time: "00:00/01:00/test",
        };
        const result = checkFormL(object);
        expect(result).toBe(true);
    });
    test("checkFormL는 잘못된 형식에 대해 false를 반환한다", () => {
        const object = {
            cinema: "test|test|test",
            movie: "test",
            time: "0000/0100/test",
        };
        const result = checkFormL(object);
        expect(result).toBe(false);
    });
    test("checkFormM는 입력된 데이터가 MEGABOX API의 형식에 맞는지 확인한다", () => {
        const object = {
            cinema: "test/test",
            movie: "test",
            time: "00:00/01:00/test",
        };
        const result = checkFormM(object);
        expect(result).toBe(true);
    });
    test("checkFormM는 잘못된 형식에 대해 false를 반환한다", () => {
        const object = {
            cinema: "test/test/test",
            movie: "test",
            time: "00:00/01:00/test",
        };
        const result = checkFormM(object);
        expect(result).toBe(true);
    });
});
