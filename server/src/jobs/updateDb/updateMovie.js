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
    L: [RepresentationMovieCode],
    M: [movieNo],
};

const hashWithMD5 = (data) => {
    return crypto.createHash("md5").update(data).digest("hex");
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
        const compareResult = compareSavedHash(mode, data);

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
    try {
        const response = [];
        const data = response;

        count = await updateData("L", data);
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Movie:{LOTTE CINEMA} - ${count} objects updated`);
};

const updateMovieM = async () => {
    let count = 0;
    try {
        const response = [];
        const data = response;

        count = await updateData("M", data);
    } catch (err) {
        global.errorLogger(err);
    }
    console.log(`Movie:{MEGABOX} - ${count} objects updated`);
};

module.exports = { updateMovieC, updateMovieL, updateMovieM };
