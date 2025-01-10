// 전역 함수 등록
require("./src/utils/errorLogger");
require("./src/utils/bodyGenerator");
require("./src/utils/dateGenerator");

const express = require("express"); // Express 웹 프레임워크
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path"); // 파일 및 디렉토리 경로 처리 모듈
const morgan = require("morgan"); // HTTP 요청 로깅 미들웨어
const dotenv = require("dotenv"); // 환경 변수 관리 라이브러리

// 환경 변수 로드
dotenv.config({ path: "./config/envs/.env" });
dotenv.config({ path: "./config//envs/url.env" });

const mongoose = require("./config/db"); // MongoDB 연결 설정 파일
const v1 = require("./src/routes/v1/v1"); // v1 API 라우터
const index = require("./src/routes/index");

const app = express(); // Express 애플리케이션 생성

// SSL 인증서 경로 (key와 cert 파일)
const sslKeyPath = path.join(__dirname, "config", "keys", "key.pem");
const sslCertPath = path.join(__dirname, "config", "keys", "cert.pem");

// SSL 인증서 로드
const options = {
    key: fs.readFileSync(sslKeyPath), // 개인 키
    cert: fs.readFileSync(sslCertPath), // 인증서
};

// MongoDB 연결 설정
mongoose.connect();

// 미들웨어 등록
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 등록
app.use("/", v1);
app.use("/", index);

http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80, () => {
    console.log(
        "HTTP Server is running on http://localhost:80 and redirects to HTTPS"
    );
});

// HTTPS 서버 시작
https
    .createServer(options, app)
    .listen(443, () => {
        console.log("HTTPS Server is running on https://localhost:443");
    })
    .on("error", (err) => {
        console.error("HTTPS Server error: ", err);
    });
