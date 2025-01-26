const statService = require("../../services/v1/checkCine/stat");
const dateService = require("../../services/v1/checkCine/date");
const cinemaService = require("../../services/v1/checkCine/cinema");
const movieService = require("../../services/v1/checkCine/movie");
const timeService = require("../../services/v1/checkCine/time");

const CreateCheckCineRequestDto = require("../../dtos/checkCineRequest.dto");
const CreateCheckCineResponseDto = require("../../dtos/checkCineResponse.dto");

const stat = async (req, res) => {
    try {
        const result = await statService.getStatus();
        const responseDto = new CreateCheckCineResponseDto({
            status: 200,
            message: "success",
            data: result,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const date = async (req, res) => {
    try {
        const requestDto = new CreateCheckCineRequestDto(req.body);
        requestDto.validate("date");
        const result = await dateService.getDates({ mode: requestDto.mode });
        const responseDto = new CreateCheckCineResponseDto({
            status: 200,
            message: "success",
            data: result,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const cinema = async (req, res) => {
    try {
        const requestDto = new CreateCheckCineRequestDto(req.body);
        requestDto.validate("cinema");
        const result = await cinemaService.getCinemas({
            mode: requestDto.mode,
            date: requestDto.date,
        });
        const responseDto = new CreateCheckCineResponseDto({
            status: 200,
            message: "success",
            data: result,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const movie = async (req, res) => {
    try {
        const requestDto = new CreateCheckCineRequestDto(req.body);
        requestDto.validate("movie");
        const result = await movieService.getMovies({
            mode: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
        });
        const responseDto = new CreateCheckCineResponseDto({
            status: 200,
            message: "success",
            data: result,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const time = async (req, res) => {
    try {
        const requestDto = new CreateCheckCineRequestDto(req.body);
        requestDto.validate("time");
        const result = await timeService.getTimes({
            mode: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
        });
        const responseDto = new CreateCheckCineResponseDto({
            status: 200,
            message: "success",
            data: result,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

module.exports = { stat, date, cinema, movie, time };
