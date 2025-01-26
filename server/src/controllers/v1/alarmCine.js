const registerService = require("../../services/v1/alarmCine/register");
const unregisterService = require("../../services/v1/alarmCine/unregister");

const CreateAlarmCineRequestDto = require("../../dtos/alarmCineRequest.dto");
const CreateAlarmCineResponseDto = require("../../dtos/alarmCineResponse.dto");

const register = async (req, res) => {
    try {
        const requestDto = new CreateAlarmCineRequestDto(req.body);
        requestDto.validate("register");
        await registerService.register({
            uuid: requestDto.uuid,
            multiplex: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
            time: requestDto.time,
        });
        const responseDto = new CreateAlarmCineResponseDto({
            status: 200,
            message: "success",
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

const unregister = async (req, res) => {
    try {
        const requestDto = new CreateAlarmCineRequestDto(req.body);
        requestDto.validate("unregister");
        await unregisterService.unregister({
            uuid: requestDto.uuid,
            multiplex: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
            time: requestDto.time,
        });
        const responseDto = new CreateAlarmCineResponseDto({
            status: 200,
            message: "success",
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

module.exports = { register, unregister };
