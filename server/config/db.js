const mongoose = require("mongoose");

const connect = () => {
    mongoose.set("strictPopulate", false);

    mongoose
        .connect(process.env.MONGO_URI || "")
        .then(() => console.log("MongoDB 연결 성공"))
        .catch((err) => console.log("MongoDB 연결 실패", err));

    mongoose.connection.on("disconnected", () => {
        console.error("MongoDB 연결이 끊어졌습니다. 재연결 시도 중...");
        connect();
    });
};

module.exports = { connect };
