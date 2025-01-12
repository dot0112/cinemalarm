require("../../../src/utils/errorLogger");
global.bodyGenerator = jest.fn();

const {
    updateMovieC,
    updateMovieL,
    updateMovieM,
    updateData,
    compareSavedHash,
} = require("../../../src/jobs/updateDb/updateMovie");
const metaModel = require("../../../src/models/meta");

const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

jest.mock("axios");
jest.mock("form-data");
jest.mock("../../../src/models/meta");

dotenv.config({ path: "./config/envs/.env" });

describe("updateMovie 테스트", () => {
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
                RepresentationMovieCode: "test1",
                MovieNameKR: "test",
                PosterURL: "test",
                ViewGradeNameKR: "test",
                PlayTime: 0,
            },
            {
                RepresentationMovieCode: "test2",
                MovieNameKR: "test",
                PosterURL: "test",
                ViewGradeNameKR: "test",
                PlayTime: 0,
            },
            {
                RepresentationMovieCode: "test3",
                MovieNameKR: "test",
                PosterURL: "test",
                ViewGradeNameKR: "test",
                PlayTime: 0,
            },
        ];
        const resultL = await updateData(mockMode, mockData);
        expect(resultL).toBe(3);

        mockMode = "M";
        mockData = [
            {
                movieNo: "test1",
                movieNm: "test",
                admisClassCdNm: "test",
                playTime: "test",
                movieImgPath: "test",
            },
        ];
        const resultM = await updateData(mockMode, mockData);
        expect(resultM).toBe(1);

        mockMetadata.dataHashCinema = correctHash;
        mockData = "test data";
        const result0 = await updateData(mockMode, mockData);
        expect(result0).toBe(0);
    });

    test("updateMovieC는 CGV의 영화 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await updateMovieC();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Movie:{CGV} - 0 objects updated"
        );
        consoleSpy.mockRestore();
    });

    test("updateMovieL는 LOTTE CINEMA의 영화 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                Movies: {
                    Movies: {
                        Items: [
                            {
                                RepresentationMovieCode: "19344",
                                MovieNameKR: "더 퍼스트 슬램덩크",
                                PosterURL: ".jpg",
                                ViewGradeNameKR: "12",
                                PlayTime: 125,
                            },
                        ],
                    },
                },
            },
        });

        await updateMovieL();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Movie:{LOTTE CINEMA} - 1 objects updated"
        );
        consoleSpy.mockRestore();
    });

    test("updateMovieM는 MEGABOX의 영화 정보를 최신화한다", async () => {
        const consoleSpy = jest.spyOn(console, "log");

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                movieList: [
                    {
                        movieNo: "24130600",
                        admisClassCdNm: "전체관람가",
                        movieNm: "말할 수 없는 비밀",
                        playTime: "103",
                        movieImgPath: ".jpg",
                    },
                ],
                crtnMovieList: [
                    {
                        movieNo: "24080400",
                        admisClassCdNm: "전체관람가",
                        movieNm: "무파사: 라이온 킹",
                        playTime: "118",
                        movieImgPath: ".jpg",
                    },
                    {
                        movieNo: "24036800",
                        admisClassCdNm: "전체관람가",
                        movieNm: "모아나 2",
                        playTime: "100",
                        movieImgPath: ".jpg",
                    },
                ],
            },
        });

        await updateMovieM();
        expect(consoleSpy).toHaveBeenCalledWith(
            "Movie:{MEGABOX} - 3 objects updated"
        );
        consoleSpy.mockRestore();
    });
});
