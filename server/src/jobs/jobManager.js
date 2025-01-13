const cron = require("node-cron");

const { updateDb } = require("./updateDb/updateDbJob");

const initJobManager = () => {
    cron.schedule("*/30 * * * *", updateDb);
};

module.exports = { initJobManager };
