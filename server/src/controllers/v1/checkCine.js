const statService = require("../../services/v1/checkCine/stat");
const dateService = require("../../services/v1/checkCine/date");
const cinemaService = require("../../services/v1/checkCine/cinema");
const movieService = require("../../services/v1/checkCine/movie");
const timeService = require("../../services/v1/checkCine/time");
const CreateCheckCineRequestDto = require("../../dtos/checkCineRequest.dto");

const stat = async (req, res) => {
    try {
        const result = await statService.getStatus();
        res.json(result);
    } catch (err) {
        global.errorLogger(err);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

const date = async (req, res) => {
    try {
        const dto = new CreateCheckCineRequestDto(req.body);
        dto.validate("date");
        const result = await dateService.getDates({ mode: dto.mode });
        res.json(result);
    } catch (err) {
        global.errorLogger(err);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

const cinema = async (req, res) => {
    try {
        const dto = new CreateCheckCineRequestDto(req.body);
        dto.validate("cinema");
        const result = await cinemaService.getCinemas({
            mode: dto.mode,
            date: dto.date,
        });
        res.json(result);
    } catch (err) {
        global.errorLogger(err);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

const movie = async (req, res) => {
    try {
        const dto = new CreateCheckCineRequestDto(req.body);
        dto.validate("movie");
        const result = await movieService.getMovies({
            mode: dto.mode,
            date: dto.date,
            cinema: dto.cinema,
        });
        res.json(result);
    } catch (err) {
        global.errorLogger(err);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

const time = async (req, res) => {
    try {
        const dto = new CreateCheckCineRequestDto(req.body);
        dto.validate("time");
        const result = await timeService.getTimes({
            mode: dto.mode,
            date: dto.date,
            cinema: dto.cinema,
            movie: dto.movie,
        });
        res.json(result);
    } catch (err) {
        global.errorLogger(err);
        res.status(500).json({
            error: "An error occurred on the server.",
            message: err.message || "Unknown error",
        });
    }
};

module.exports = { stat, date, cinema, movie, time };
