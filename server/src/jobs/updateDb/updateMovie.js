const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");

const metaModel = require("../../models/meta");
const movieCModel = require("../../models/movie/movieC");
const movieLModel = require("../../models/movie/movieL");
const movieMModel = require("../../models/movie/movieM");
const movieM = require("../../models/movie/movieM");

const movieModels = {
    C: movieCModel,
    L: movieLModel,
    M: movieMModel,
};

const modelKeys = {
    C: [],
    L: ["RepresentationMovieCode"],
    M: ["movieNo"],
};

const hashWithMD5 = (data) => {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
};

const compareSavedHash = async (mode, data) => {
    let result = false;
    const hash = hashWithMD5(data);

    try {
        const metadata = await metaModel.findOne({ multiplex: mode });
        const savedHash = metadata ? metadata.dataHashMovie ?? "" : "";

        result = savedHash === hash;

        if (savedHash !== hash) {
            if (metadata) {
                metadata.dataHashMovie = hash;
                await metadata.save();
            } else {
                await metaModel.create({
                    multiplex: mode,
                    dataHashMovie: hash,
                });
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }

    return result;
};

const updateData = async (mode, data) => {
    let count = 0;
    try {
        const compareResult = await compareSavedHash(mode, data);

        if (!compareResult) {
            if (data.length > 0) {
                const bulkOps = [];

                for (const item of data) {
                    const keys = {};

                    for (const key of modelKeys[mode]) {
                        keys[key] = item[key];
                    }

                    bulkOps.push({
                        updateOne: {
                            filter: keys,
                            update: { $set: item },
                            upsert: true,
                        },
                    });
                }

                if (bulkOps.length > 0) {
                    const result = await movieModels[mode].bulkWrite(bulkOps);
                    count = result.upsertedCount + result.modifiedCount;
                }
            }
        }
    } catch (err) {
        global.errorLogger(err);
    }
    return count;
};

const updateMovieC = async () => {
    let count = 0;
    try {
        const response = [];
        const data = response;

        count = await updateData("C", data);
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Movie:{CGV} - ${count} objects updated`);
};

const updateMovieL = async () => {
    let count = 0;
    const formData = new FormData();
    formData.append("paramList", JSON.stringify(global.bodyGenerator("L")));
    try {
        const response = await axios.post(
            `${process.env.LOTTECINEMA_URL}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );
        if (response.status === 200) {
            const data = [];
            const dataRaw = response.data;
            const movieRaws = dataRaw.Movies.Movies.Items;

            for (const movieRaw of movieRaws) {
                data.push({
                    RepresentationMovieCode: movieRaw.RepresentationMovieCode,
                    MovieNameKR: movieRaw.MovieNameKR,
                    PosterURL: movieRaw.PosterURL,
                    ViewGradeNameKR: movieRaw.ViewGradeNameKR,
                    PlayTime: movieRaw.PlayTime,
                });
            }

            count = await updateData("L", data);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Movie:{LOTTE CINEMA} - ${count} objects updated`);
};

const updateMovieM = async () => {
    let count = 0;
    const bodyData = global.bodyGenerator("M");
    try {
        const response = await axios.post(
            `${process.env.MEGABOX_URL}`,
            bodyData
        );
        if (response.status === 200) {
            const data = [];
            const dataRaw = response.data;
            const movieRaws = [...dataRaw.movieList, ...dataRaw.crtnMovieList];

            for (const movieRaw of movieRaws) {
                data.push({
                    movieNo: movieRaw.movieNo,
                    movieNm: movieRaw.movieNm,
                    admisClassCdNm: movieRaw.admisClassCdNm,
                    playTime: movieRaw.playTime,
                    movieImgPath: movieRaw.movieImgPath,
                });
            }

            count = await updateData("M", data);
        }
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Movie:{MEGABOX} - ${count} objects updated`);
};

module.exports = {
    updateMovieC,
    updateMovieL,
    updateMovieM,
    updateData,
    compareSavedHash,
};
