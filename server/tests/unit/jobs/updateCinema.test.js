require("../../../src/utils/errorLogger");
global.bodyGenerator = jest.fn();

const {
    updateCinemaC,
    updateCinemaL,
    updateCinemaM,
    updateData,
    compareSavedHash,
} = require("../../../src/jobs/updateDb/updateCinema");
const metaModel = require("../../../src/models/meta");

const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

jest.mock("axios");
jest.mock("form-data");
jest.mock("../../../src/models/meta");

dotenv.config({ path: "./config/envs/.env" });

describe("updateCinema 테스트", () => {
    let mockMetadata;
    const correctHash = "951cbaa11278008e945e03e38449d1a6";

    beforeEach(() => {
        mockMetadata = {
            dataHashCinema: "wrong hash",
            save: jest.fn(),
        };
        metaModel.findOne = jest.fn().mockResolvedValue(mockMetadata);
    });

    beforeAll(async () => {
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 연결 타임아웃 시간 증가
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("compareSavedHash는 Db의 해싱 값과 데이터의 해싱 값을 비교한다", async () => {
        const mockMode = "testMode";
        const mockData = "test data";

        const result1 = await compareSavedHash(mockMode, mockData);
        expect(metaModel.findOne).toHaveBeenCalledWith({ multiplex: mockMode });
        expect(mockMetadata.save).toHaveBeenCalled();
        expect(result1).toBe(false);

        mockMetadata.save.mockClear();
        mockMetadata.dataHashCinema = correctHash;
        const result2 = await compareSavedHash(mockMode, mockData);
        expect(metaModel.findOne).toHaveBeenCalledWith({ multiplex: mockMode });
        expect(mockMetadata.save).not.toHaveBeenCalled();
        expect(result2).toBe(true);
    });

    test("updateData는 데이터를 실제 Db에 최신화한다", async () => {
        let mockMode = "C";
        let mockData = [];
        const resultC = await updateData(mockMode, mockData);

        mockMode = "L";
        mockData = [
            {
                DivisionCode: 0,
                DetailDivisionCode: "test",
                CinemaID: 0,
                GroupNameKR: "update",
                CinemaNameKR: "update",
            },
            {
                DivisionCode: 1,
                DetailDivisionCode: "test",
                CinemaID: 0,
                GroupNameKR: "upsert",
                CinemaNameKR: "upsert",
            },
        ];
        const resultL = await updateData(mockMode, mockData);
        expect(resultL).toBe(2);

        mockMode = "M";
        mockData = [
            {
                areaCd: "test",
                brchNo: "test",
                areaCdNm: "update",
                brchNm: "update",
            },
            {
                areaCd: "test2",
                brchNo: "test",
                areaCdNm: "upsert",
                brchNm: "upsert",
            },
        ];
        const resultM = await updateData(mockMode, mockData);
        expect(resultM).toBe(2);

        mockMetadata.dataHashCinema = correctHash;
        mockData = "test data";
        const result0 = await updateData(mockMode, mockData);
        expect(result0).toBe(0);
    });

    test("updateCinemaC는 CGV의 지점 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await updateCinemaC();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Cinema:{CGV} - 0 objects updated"
        );
        consoleSpy.mockRestore();
    });

    test("updateCinemaL은 LOTTE CINEMA의 지점 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                CinemaDivision: {
                    AreaDivisions: {
                        Items: [
                            {
                                DivisionCode: 1,
                                DetailDivisionCode: "0001",
                                GroupNameKR: "서울",
                            },
                        ],
                    },
                    SpecialTypeDivisions: {
                        Items: [
                            {
                                DivisionCode: 2,
                                DetailDivisionCode: "0300",
                                GroupNameKR: "샤롯데",
                            },
                        ],
                    },
                },
                Cinemas: {
                    Cinemas: {
                        Items: [
                            {
                                DivisionCode: 1,
                                DetailDivisionCode: "0001",
                                CinemaID: 1013,
                                CinemaNameKR: "가산디지털",
                            },
                        ],
                    },
                },
            },
        });

        await updateCinemaL();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Cinema:{LOTTE CINEMA} - 1 objects updated"
        );
        consoleSpy.mockRestore();
    });

    test("updateCinemaM은 MEGABOX의 저점 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                areaBrchList: [
                    {
                        areaCd: "10",
                        areaCdNm: "서울",
                        brchNo: "1372",
                        brchNm: "강남",
                    },
                ],
                spclbBrchList: [
                    {
                        areaCd: "DBC",
                        areaCdNm: "DOLBY CINEMA",
                        brchNo: "0019",
                        brchNm: "남양주현대아울렛 스페이스원",
                    },
                ],
            },
        });

        await updateCinemaM();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Cinema:{MEGABOX} - 2 objects updated"
        );
        consoleSpy.mockRestore();
    });
});
