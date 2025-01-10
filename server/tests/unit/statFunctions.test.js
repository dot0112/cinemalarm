const { statC, statL, statM } = require("../../src/services/v1/checkCine/stat"); // 실제 경로에 맞게 조정
const axios = require("axios");
const FormData = require("form-data");
jest.mock("axios"); // axios를 mock하여 테스트 환경에 맞게 조정
jest.mock("form-data");

global.errorLogger = jest.fn();
global.bodyGenerator = jest.fn();

describe("statFunctions 테스트", () => {
    test("statC는 CGV API 동작 여부를 확인한다", async () => {
        // statC 함수의 동작을 테스트
        const result = await statC();
        expect(result.C).toBe(false); // 예시로 false가 반환되면 올바르게 동작한다고 가정
    });

    test("statL은 LOTTE CINEMA API 동작 여부를 확인한다", async () => {
        // axios의 응답을 mock
        axios.post.mockResolvedValue({ status: 200 });

        const result = await statL();
        expect(result.L).toBe(true); // 200 상태이면 true로 결과가 나옴
    });

    test("statM은 MEGABOX API 동작 여부를 확인한다", async () => {
        // axios의 응답을 mock
        axios.post.mockResolvedValue({ status: 200 });

        const result = await statM();
        expect(result.M).toBe(true); // 200 상태이면 true로 결과가 나옴
    });
});
