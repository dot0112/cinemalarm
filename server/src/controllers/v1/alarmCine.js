const registerService = require("../../services/v1/alarmCine/register");
const unregisterService = require("../../services/v1/alarmCine/unregister");

const CreateAlarmCineRequestDto = require("../../dtos/alarmCineRequest.dto");
const CreateAlarmCineResponseDto = require("../../dtos/alarmCineResponse.dto");

const register = async (req, res) => {
    try {
        const requestDto = new CreateAlarmCineRequestDto(req.body);
        requestDto.validate("register");
        const result = await registerService.register({
            uuid: requestDto.uuid,
            multiplex: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
            time: requestDto.time,
        });
        const responseDto = new CreateAlarmCineResponseDto({
            status: result.status,
            message: result.message,
            data: result.data,
            error: result.error,
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
        const result = await unregisterService.unregister({
            uuid: requestDto.uuid,
            multiplex: requestDto.mode,
            date: requestDto.date,
            cinema: requestDto.cinema,
            movie: requestDto.movie,
            time: requestDto.time,
        });
        const responseDto = new CreateAlarmCineResponseDto({
            status: result.status,
            message: result.message,
            data: result.data,
            error: result.error,
        });
        res.status(responseDto.status).json(responseDto);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
};

module.exports = { register, unregister };
